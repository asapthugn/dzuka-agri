from services.openai_service import client
from graph.state import DzukaState
from prompts.review_prompt import get_review_prompt


def review_agent(state: DzukaState):

    prompt = get_review_prompt(
        state["agronomy_output"],
        state["climate_output"],
        state["pest_output"],
        state["market_output"]
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"final_recommendation": response.choices[0].message.content}