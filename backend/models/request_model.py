from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    crop: str
    symptoms: str
    latitude: float
    longitude: float