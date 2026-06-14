from fastapi import APIRouter

from graph.workflow import app
from models.request_model import RecommendationRequest
from models.response_model import RecommendationResponse

router = APIRouter()


@router.post("/recommendation",
             response_model=RecommendationResponse)
def recommendation(
        request: RecommendationRequest):

    initial_state = {
        "crop": request.crop,
        "symptoms": request.symptoms,
        "latitude": request.latitude,
        "longitude": request.longitude,
        "task": "diagnose"
    }

    result = app.invoke(initial_state)

    return {
        "recommendation":
        result["final_recommendation"]
    }