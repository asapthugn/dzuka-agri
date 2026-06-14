from services.openai_service import client
from graph.state import DzukaState
from tools.weather_tool import get_weather_data
from prompts.climate_prompt import get_climate_prompt


def climate_agent(state: DzukaState):
    weather_data = get_weather_data(state["latitude"], state["longitude"])
    prompt = get_climate_prompt(state["latitude"], state["longitude"], weather_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"climate_output": response.choices[0].message.content}
