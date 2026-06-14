from fastapi import APIRouter, HTTPException, UploadFile, File

from graph.workflow import app
from models.request_model import RecommendationRequest
from models.response_model import RecommendationResponse
from tools.vision_tool import analyze_crop_image

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
        return {"recommendation": result["final_recommendation"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-image")
async def analyze_image(crop: str, file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        analysis = analyze_crop_image(image_bytes, crop)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
