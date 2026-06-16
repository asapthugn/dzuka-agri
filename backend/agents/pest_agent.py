from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.geospatial_tool import get_nearest_region
from prompts.pest_prompt import get_pest_prompt


def pest_agent(state: DzukaState):
    nearest = get_nearest_region(state["latitude"], state["longitude"])
    region_name = nearest["region"] if nearest else "Unknown Region"

    prompt = get_pest_prompt(state["crop"], state["symptoms"], region_name)

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512
    )

    return {"pest_output": response.choices[0].message.content}
