from services.openai_service import client
from graph.state import DzukaState
from prompts.pest_prompt import get_pest_prompt


def pest_agent(state: DzukaState):
    prompt = get_pest_prompt(state["crop"], state["symptoms"])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"pest_output": response.choices[0].message.content}