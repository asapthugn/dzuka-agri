from fastapi import APIRouter, HTTPException
from models.schemas import GeoLookupRequest
from tools.geocoding_tool import reverse_geocode
from tools.weather_tool import get_weather_data

geo_router = APIRouter()


@geo_router.post("/lookup")
def geo_lookup(request: GeoLookupRequest):
    """Returns real location name + live weather for the given coordinates."""
    try:
        location = reverse_geocode(request.latitude, request.longitude)
        weather = get_weather_data(request.latitude, request.longitude)

        # Extract current conditions from Open-Meteo response
        current = {}
        if isinstance(weather, dict) and "current" in weather:
            c = weather["current"]
            current = {
                "temp_c": c.get("temperature_2m"),
                "humidity_pct": c.get("relative_humidity_2m"),
                "rainfall_mm": c.get("precipitation"),
                "wind_kmh": c.get("wind_speed_10m"),
            }

        return {
            "location": location["display"],
            "city": location["city"],
            "state": location["state"],
            "country": location["country"],
            "weather": current,
            # Keep nearest_region for backwards compatibility with frontend badges
            "nearest_region": {"region": location["display"]},
            "soil": None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@geo_router.get("/regions")
def list_geo_regions():
    """Returns the supported regions (kept for reference)."""
    return {"message": "Region detection is now fully dynamic via reverse geocoding."}
