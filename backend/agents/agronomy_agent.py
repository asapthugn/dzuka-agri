from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.geocoding_tool import reverse_geocode
from prompts.agronomy_prompt import get_agronomy_prompt


def agronomy_agent(state: DzukaState):
    location = reverse_geocode(state["latitude"], state["longitude"])

    prompt = get_agronomy_prompt(state["crop"], location["display"], state["latitude"], state["longitude"])

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512,
    )

    return {"agronomy_output": response.choices[0].message.content}
