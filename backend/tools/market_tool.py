import json
import os


def get_market_data(crop: str) -> list:
    data_path = os.path.join(os.path.dirname(__file__), "../data/market.json")
    with open(data_path) as f:
        market_data = json.load(f)

    matches = [m for m in market_data if m["crop"].lower() == crop.lower()]
    return matches if matches else market_data
