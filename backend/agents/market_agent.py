from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.market_tool import get_market_data
from tools.geospatial_tool import get_nearest_region
from prompts.market_prompt import get_market_prompt


def market_agent(state: DzukaState):
    nearest = get_nearest_region(state["latitude"], state["longitude"])
    region_code = nearest["region_code"] if nearest else None
    region_name = nearest["region"] if nearest else "Unknown Region"

    market_data = get_market_data(state["crop"], region_code)

    prompt = get_market_prompt(state["crop"], market_data, region_name)

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512
    )

    return {"market_output": response.choices[0].message.content}
