from services.openai_service import client
from graph.state import DzukaState


def agronomy_agent(state: DzukaState):

    prompt = f"""
You are an agricultural expert.

Crop:
{state['crop']}

Provide:
1. Best farming practices.
2. Fertilizer recommendations.
3. Irrigation recommendations.

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
        "agronomy_output": response.choices[0].message.content
    }