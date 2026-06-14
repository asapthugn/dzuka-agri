from pydantic import BaseModel


class DzukaState(BaseModel):

    crop: str
    symptoms: str
    latitude: float
    longitude: float

    agronomy_output: str = ""
    climate_output: str = ""
    pest_output: str = ""
    market_output: str = ""

    final_recommendation: str = ""