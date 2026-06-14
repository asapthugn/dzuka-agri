import json
import os


def get_soil_data(region: str = None) -> list:
    data_path = os.path.join(os.path.dirname(__file__), "../data/soil.json")
    with open(data_path) as f:
        soil_data = json.load(f)

    if region:
        matches = [s for s in soil_data if region.lower() in s["region"].lower()]
        return matches if matches else soil_data
    return soil_data
