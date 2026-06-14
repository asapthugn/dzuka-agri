from typing import TypedDict


class DzukaState(TypedDict):

    # User Input
    crop: str
    symptoms: str
    latitude: float
    longitude: float

    # Orchestrator
    task: str

    # Agent Outputs
    agronomy_output: str
    climate_output: str
    pest_output: str

    # Review
    final_recommendation: str