import json
import os


def get_soil_data(region_code: str = None) -> dict | list:
    data_path = os.path.join(os.path.dirname(__file__), "../data/soil.json")
    with open(data_path) as f:
        soil_data = json.load(f)

    if region_code:
        match = next((s for s in soil_data if s.get("region_code") == region_code), None)
        return match if match else soil_data[0]

    return soil_data
