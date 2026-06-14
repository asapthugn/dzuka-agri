# backend/tests/test_geo_routes.py
from fastapi.testclient import TestClient
import pytest

from main import app
from api import geo_routes

client = TestClient(app)

def test_geo_routes_mounted():
    paths = app.openapi()["paths"]
    assert "/api/geo/regions" in paths
    assert "/api/geo/lookup" in paths

def test_regions_success_shape():
    response = client.get("/api/geo/regions")
    assert response.status_code == 200
    body = response.json()
    assert "regions" in body
    assert isinstance(body["regions"], list)

def test_lookup_success_shape():
    payload = {"latitude": -13.98, "longitude": 33.78, "crop": "maize"}
    response = client.post("/api/geo/lookup", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "nearest_region" in body
    assert "soil" in body

def test_lookup_crop_filter_case_and_whitespace():
    payload_clean = {"latitude": -13.98, "longitude": 33.78, "crop": "maize"}
    payload_messy = {"latitude": -13.98, "longitude": 33.78, "crop": "  MaIzE  "}
    clean = client.post("/api/geo/lookup", json=payload_clean)
    messy = client.post("/api/geo/lookup", json=payload_messy)
    assert clean.status_code == 200
    assert messy.status_code == 200
    assert clean.json()["market"] == messy.json()["market"]

def test_lookup_invalid_latitude_422():
    payload = {"latitude": 95.0, "longitude": 33.78, "crop": "maize"}
    response = client.post("/api/geo/lookup", json=payload)
    assert response.status_code == 422

def test_lookup_not_found_maps_to_404(monkeypatch):
    def _raise_not_found(latitude, longitude, crop=None):
        raise ValueError("No regional data found. Check JSON files.")
    
    monkeypatch.setattr(geo_routes, "geospatial_lookup", _raise_not_found)
    payload = {"latitude": -13.98, "longitude": 33.78, "crop": "maize"}
    response = client.post("/api/geo/lookup", json=payload)
    assert response.status_code == 404