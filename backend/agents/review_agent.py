from graph.state import DzukaState


def review_agent(state: DzukaState):

    agronomy = state["agronomy_output"]
    climate = state["climate_output"]
    pest = state["pest_output"]

    recommendation = f"""
Agronomy:
{agronomy}

Climate:
{climate}

Pest Analysis:
{pest}

Final Advice:
Delay fertilizer application if heavy rainfall is expected.
"""

    return {
        "final_recommendation": recommendation
    }