from pydantic import BaseModel
from typing import Optional, Dict, Any

class GeoLookupRequest(BaseModel):
    latitude: float
    longitude: float
    crop: Optional[str] = None

class GeoRegion(BaseModel):
    region_code: str
    region_name: str
    centroid_lat: float
    centroid_lon: float

class GeoLookupResponse(BaseModel):
    nearest_region: GeoRegion
    soil_profile: Dict[str, Any]
    weather_profile: Dict[str, Any]
    market_profile: Optional[Dict[str, Any]] = None