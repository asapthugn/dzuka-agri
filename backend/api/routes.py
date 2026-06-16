from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
import json

from graph.workflow import app
from models.request_model import RecommendationRequest
from models.response_model import RecommendationResponse
from tools.vision_tool import analyze_crop_image
from services.openai_service import client, TEXT_MODEL
from agents.agronomy_agent import agronomy_agent
from agents.climate_agent import climate_agent
from agents.pest_agent import pest_agent
from agents.market_agent import market_agent
from prompts.review_prompt import get_review_prompt

router = APIRouter()


@router.post("/recommendation", response_model=RecommendationResponse)
def recommendation(request: RecommendationRequest):
    try:
        initial_state = {
            "crop": request.crop,
            "symptoms": request.symptoms,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "task": "diagnose"
        }
        result = app.invoke(initial_state)
        return {
            "recommendation": result["final_recommendation"],
            "agronomy_output": result.get("agronomy_output"),
            "climate_output": result.get("climate_output"),
            "pest_output": result.get("pest_output"),
            "market_output": result.get("market_output"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommendation/stream")
async def recommendation_stream(request: RecommendationRequest):
    """
    Runs all agents then streams the final action plan token by token.
    Sends agent outputs as SSE metadata first, then streams the review.
    """
    def generate():
        try:
            state = {
                "crop": request.crop,
                "symptoms": request.symptoms,
                "latitude": request.latitude,
                "longitude": request.longitude,
                "task": "diagnose",
                "agronomy_output": None,
                "climate_output": None,
                "pest_output": None,
                "market_output": None,
                "final_recommendation": None,
            }

            # Resolve nearest region once and emit it to the frontend
            from tools.geospatial_tool import get_nearest_region
            nearest = get_nearest_region(request.latitude, request.longitude)
            if nearest:
                yield f"data: {json.dumps({'type': 'region', 'region': nearest['region'], 'region_code': nearest['region_code'], 'distance_km': nearest.get('distance_km', 0)})}\n\n"

            # Run the 4 specialist agents
            state.update(agronomy_agent(state))
            yield f"data: {json.dumps({'type': 'agent', 'agent': 'agronomy', 'content': state['agronomy_output']})}\n\n"

            state.update(climate_agent(state))
            yield f"data: {json.dumps({'type': 'agent', 'agent': 'climate', 'content': state['climate_output']})}\n\n"

            state.update(pest_agent(state))
            yield f"data: {json.dumps({'type': 'agent', 'agent': 'pest', 'content': state['pest_output']})}\n\n"

            state.update(market_agent(state))
            yield f"data: {json.dumps({'type': 'agent', 'agent': 'market', 'content': state['market_output']})}\n\n"

            # Stream the review agent token by token
            yield f"data: {json.dumps({'type': 'stream_start'})}\n\n"

            prompt = get_review_prompt(
                state["agronomy_output"],
                state["climate_output"],
                state["pest_output"],
                state["market_output"],
            )

            stream = client.chat.completions.create(
                model=TEXT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                stream=True,
                max_tokens=1024,
            )

            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'type': 'token', 'content': delta})}\n\n"

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post("/chat/stream")
async def chat_stream(payload: dict):
    """
    Contextual chatbot — answers follow-up questions strictly based on
    the farm analysis data passed in the request body.
    """
    user_message: str = payload.get("message", "")
    context: dict = payload.get("context", {})
    history: list = payload.get("history", [])

    if not user_message:
        raise HTTPException(status_code=400, detail="message is required")

    system_prompt = f"""You are Dzuka, an expert agricultural AI assistant. You are knowledgeable about farming, crops, soil science, weather, pest management, markets, geography, and rural livelihoods worldwide.

A farmer has completed a full AI analysis of their farm. You have access to their analysis results below. Use this data to give personalized, specific answers when relevant. But you can also answer any general question the farmer asks — about their region, geography, agriculture, crop science, prices, or anything else.

Be helpful, warm, and practical. Speak like a knowledgeable friend, not a restricted system.

--- THIS FARMER'S ANALYSIS ---

AGRONOMY & SOIL:
{context.get('agronomy', 'Not available')}

CLIMATE & WEATHER:
{context.get('climate', 'Not available')}

PEST & DISEASE:
{context.get('pest', 'Not available')}

MARKET:
{context.get('market', 'Not available')}

FINAL ACTION PLAN:
{context.get('recommendation', 'Not available')}

--- END OF ANALYSIS ---

Guidelines:
- When the question relates to their farm data, refer to it specifically.
- When they ask general questions (geography, crop science, prices elsewhere, etc.), answer freely and accurately.
- Keep answers concise and actionable. Use bullet points for steps or lists.
- If you don't know something, say so honestly — don't make up data.
"""

    messages = [{"role": "system", "content": system_prompt}]

    # Include previous conversation turns
    for turn in history[-10:]:  # keep last 10 turns to avoid token overflow
        messages.append({"role": turn["role"], "content": turn["content"]})

    messages.append({"role": "user", "content": user_message})

    def generate():
        try:
            stream = client.chat.completions.create(
                model=TEXT_MODEL,
                messages=messages,
                stream=True,
                max_tokens=512,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'type': 'token', 'content': delta})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post("/analyze-image")
async def analyze_image(crop: str, file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        analysis = analyze_crop_image(image_bytes, crop)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
