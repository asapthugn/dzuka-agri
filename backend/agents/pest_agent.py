from services.openai_service import client, TEXT_MODEL
from graph.state import DzukaState
from tools.geocoding_tool import reverse_geocode
from prompts.pest_prompt import get_pest_prompt


def pest_agent(state: DzukaState):
    location = reverse_geocode(state["latitude"], state["longitude"])

    prompt = get_pest_prompt(state["crop"], state["symptoms"], location["display"])

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=False,
        max_tokens=512,
    )

    return {"pest_output": response.choices[0].message.content}
