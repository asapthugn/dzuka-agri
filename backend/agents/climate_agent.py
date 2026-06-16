from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.weather_tool import get_weather_data
from tools.geocoding_tool import reverse_geocode
from prompts.climate_prompt import get_climate_prompt


def climate_agent(state: DzukaState):
    location = reverse_geocode(state["latitude"], state["longitude"])
    weather_data = get_weather_data(state["latitude"], state["longitude"])

    prompt = get_climate_prompt(state["latitude"], state["longitude"], weather_data, location["display"])

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512,
    )

    return {"climate_output": response.choices[0].message.content}
