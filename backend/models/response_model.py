from pydantic import BaseModel
from typing import Optional


class RecommendationResponse(BaseModel):
    recommendation: str
    agronomy_output: Optional[str] = None
    climate_output: Optional[str] = None
    pest_output: Optional[str] = None
    market_output: Optional[str] = None