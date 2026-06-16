from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class RecommendationRequest(BaseModel):
    # Required by UI and LangGraph Agents
    crop: str = Field(..., description="Type of crop, e.g., 'maize'")
    symptoms: str = Field("", description="Description of the issue, e.g., 'yellow leaves'")
    latitude: float
    longitude: float
    
    # Optional extended context (Safe to add, won't break existing state)
    session_id: Optional[str] = Field(None, description="For tracking continuous chat sessions")
    farmer_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)