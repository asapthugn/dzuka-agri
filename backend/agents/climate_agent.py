from services.openai_service import client
from graph.state import DzukaState


def climate_agent(state: DzukaState):

    prompt = f"""
You are a climate and weather expert.

Location:
Latitude = {state['latitude']}
Longitude = {state['longitude']}

Provide:
1. Weather considerations.
2. Irrigation advice.
3. Potential environmental risks.

Keep the answer concise.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "climate_output": response.choices[0].message.content
    }