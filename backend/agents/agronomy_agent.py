from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.soil_tool import get_soil_data
from tools.geospatial_tool import get_nearest_region
from prompts.agronomy_prompt import get_agronomy_prompt


def agronomy_agent(state: DzukaState):
    nearest = get_nearest_region(state["latitude"], state["longitude"])
    region_code = nearest["region_code"] if nearest else None
    region_name = nearest["region"] if nearest else "Unknown Region"

    soil_data = get_soil_data(region_code)

    prompt = get_agronomy_prompt(state["crop"], soil_data, region_name)

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512
    )

    return {"agronomy_output": response.choices[0].message.content}
