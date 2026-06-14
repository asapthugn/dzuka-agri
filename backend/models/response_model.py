from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    recommendation: str