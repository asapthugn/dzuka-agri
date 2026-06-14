from fastapi import APIRouter, HTTPException
from models.schemas import GeoLookupRequest, GeoLookupResponse
from tools.geospatial_tool import geospatial_lookup, _load_mock_data

geo_router = APIRouter()

@geo_router.get("/regions")
def list_geo_regions():
    """Returns all known regions from the mock data."""
    soil_data = _load_mock_data("soil.json")
    regions = [
        {
            "region": item.get("region"),
            "region_code": item.get("region_code"),
            "centroid_latitude": item.get("centroid_latitude"),
            "centroid_longitude": item.get("centroid_longitude")
        }
        for item in soil_data
    ]
    return {"regions": regions}

@geo_router.post("/lookup", response_model=GeoLookupResponse)
def geo_lookup(request: GeoLookupRequest):
    """Calculates nearest region and returns aggregated local data."""
    try:
        data = geospatial_lookup(request.latitude, request.longitude, request.crop)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))