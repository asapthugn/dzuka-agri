import json
import math
from pathlib import Path
from typing import Optional, Dict, Any, List

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

def _load_mock_data(filename: str) -> List[Dict[str, Any]]:
    """Helper to load JSON files securely."""
    file_path = DATA_DIR / filename
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the distance between two points on Earth in kilometers."""
    R = 6371.0 # Earth radius in km
    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)
    
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_nearest_region(lat: float, lon: float) -> Optional[Dict[str, Any]]:
    """Finds the closest region by comparing coordinates to soil.json centroids."""
    soil_data = _load_mock_data("soil.json")
    if not soil_data:
        return None
        
    # Fix applied: Added `or 0.0` fallback in case a centroid is missing
    closest = min(soil_data, key=lambda x: haversine_distance(
        lat, lon, 
        x.get("centroid_latitude") or 0.0, 
        x.get("centroid_longitude") or 0.0
    ))
    
    return {
        "region": closest.get("region"),
        "region_code": closest.get("region_code"),
        "centroid_latitude": closest.get("centroid_latitude"),
        "centroid_longitude": closest.get("centroid_longitude")
    }

def geospatial_lookup(latitude: float, longitude: float, crop: Optional[str] = None) -> Dict[str, Any]:
    """Aggregates all localized mock data into one payload."""
    nearest = get_nearest_region(latitude, longitude)
    if not nearest:
        raise ValueError("No regional data found. Check JSON files.")
        
    region_code = nearest["region_code"]
    
    # Filter specific data by region code
    soil_data = next((item for item in _load_mock_data("soil.json") if item.get("region_code") == region_code), None)
    weather_data = next((item for item in _load_mock_data("weather.json") if item.get("region_code") == region_code), None)
    
    # Market data is a list, and we optionally filter by crop
    market_data = [
        item for item in _load_mock_data("market.json") 
        if item.get("region_code") == region_code and (not crop or item.get("crop", "").strip().lower() == crop.strip().lower())
    ]
    
    return {
        "nearest_region": nearest,
        "soil": soil_data,
        "weather": weather_data,
        "market": market_data
    }