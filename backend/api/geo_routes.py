from fastapi import APIRouter
from models.geospatial_models import GeoLookupRequest

router = APIRouter()

@router.get("/regions")
async def get_regions():
    """Returns known regions and coordinates from mock data."""
    # TODO: Wire up to backend/data/soil.json
    return {
        "status": "success",
        "data": [
            {"region_code": "MW-C", "region_name": "Central Region, Malawi", "centroid_lat": -13.7882, "centroid_lon": 34.4598}
        ]
    }

@router.post("/lookup")
async def geospatial_lookup(payload: GeoLookupRequest):
    """
    Takes coordinates and returns the localized mock data slices.
    Unblocks the frontend UI for dashboard visualization.
    """
    # TODO: Wire up to backend.tools.geospatial_tool
    return {
        "status": "success",
        "data": {
            "nearest_region": {
                "region_code": "MW-C",
                "region_name": "Central Region, Malawi",
                "centroid_lat": -13.7882,
                "centroid_lon": 34.4598
            },
            "soil_profile": {"surface_vsm_percent": 12.5, "status": "Deficit"},
            "weather_profile": {"temperature_c": 28.4, "humidity_percent": 41}
        }
    }