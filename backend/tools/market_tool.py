import json
import os


def get_market_data(crop: str, region_code: str = None) -> list:
    data_path = os.path.join(os.path.dirname(__file__), "../data/market.json")
    with open(data_path) as f:
        market_data = json.load(f)

    # Filter by both crop and region when region_code is provided
    if region_code:
        matches = [
            m for m in market_data
            if m["crop"].lower() == crop.lower() and m.get("region_code") == region_code
        ]
        if matches:
            return matches

    # Fallback: filter by crop only
    matches = [m for m in market_data if m["crop"].lower() == crop.lower()]
    return matches if matches else market_data
