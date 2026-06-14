from services.openai_service import client
from graph.state import DzukaState


def pest_agent(state: DzukaState):

    prompt = f"""
You are a plant pathology expert.

Crop:
{state['crop']}

Symptoms:
{state['symptoms']}

Identify:
1. Possible diseases or deficiencies.
2. Possible causes.
3. Treatment recommendations.

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
        "pest_output": response.choices[0].message.content
    }