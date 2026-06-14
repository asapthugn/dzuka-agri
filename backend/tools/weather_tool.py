import json
import os
import httpx


def get_live_weather(latitude: float, longitude: float) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weathercode",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "auto",
        "forecast_days": 7
    }
    response = httpx.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def get_weather_data(latitude: float = None, longitude: float = None) -> dict | list:
    if latitude is not None and longitude is not None:
        try:
            return get_live_weather(latitude, longitude)
        except Exception:
            pass

    # fallback to local mock data
    data_path = os.path.join(os.path.dirname(__file__), "../data/weather.json")
    with open(data_path) as f:
        return json.load(f)
