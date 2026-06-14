from services.openai_service import client
from graph.state import DzukaState
from tools.market_tool import get_market_data
from prompts.market_prompt import get_market_prompt


def market_agent(state: DzukaState):
    market_data = get_market_data(state["crop"])
    prompt = get_market_prompt(state["crop"], market_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"market_output": response.choices[0].message.content}
