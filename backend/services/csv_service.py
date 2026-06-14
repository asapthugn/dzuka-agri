import csv
import json
import os


def load_json(filename: str) -> list:
    data_path = os.path.join(os.path.dirname(__file__), f"../data/{filename}")
    with open(data_path) as f:
        return json.load(f)


def load_csv(filename: str) -> list:
    data_path = os.path.join(os.path.dirname(__file__), f"../data/{filename}")
    with open(data_path, newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)
