from services.openai_service import client
from graph.state import DzukaState
from tools.soil_tool import get_soil_data
from prompts.agronomy_prompt import get_agronomy_prompt


def agronomy_agent(state: DzukaState):
    soil_data = get_soil_data()
    prompt = get_agronomy_prompt(state["crop"], soil_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"agronomy_output": response.choices[0].message.content}
