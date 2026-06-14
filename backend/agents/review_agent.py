from services.openai_service import client
from graph.state import DzukaState


def review_agent(state: DzukaState):

    prompt = f"""
You are a senior agricultural advisor.

Combine the outputs from the following experts into a single action plan.

Agronomy Expert:
{state['agronomy_output']}

Climate Expert:
{state['climate_output']}

Pest Expert:
{state['pest_output']}

Provide:

1. Summary of the situation.
2. Recommended actions.
3. Priority order.
4. Final advice.

Keep the answer structured and concise.
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
        "final_recommendation": response.choices[0].message.content
    }