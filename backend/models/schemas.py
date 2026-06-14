from pydantic import BaseModel, Field
from typing import Optional, List

class GeoPoint(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class GeoLookupRequest(GeoPoint):
    crop: Optional[str] = Field(None, max_length=100)

class GeoRegion(BaseModel):
    region: str
    region_code: str
    centroid_latitude: float
    centroid_longitude: float

class SoilProfile(BaseModel):
    region: str
    soil_type: str
    ph: float
    nitrogen_ppm: float
    phosphorus_ppm: float
    potassium_ppm: float
    organic_matter_pct: float
    moisture_pct: float

class WeatherProfile(BaseModel):
    region: str
    month: Optional[str] = None
    avg_temp_c: Optional[float] = None
    rainfall_mm: Optional[float] = None
    humidity_pct: Optional[float] = None
    season: Optional[str] = None

class MarketProfile(BaseModel):
    crop: str
    price_per_kg_usd: float
    demand: str
    region: str
    month: str

class GeoLookupResponse(BaseModel):
    nearest_region: GeoRegion
    soil: Optional[SoilProfile] = None
    weather: Optional[WeatherProfile] = None
    market: List[MarketProfile] = Field(default_factory=list)