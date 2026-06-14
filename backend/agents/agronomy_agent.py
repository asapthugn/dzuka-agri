from graph.state import DzukaState


def agronomy_agent(state: DzukaState):

    crop = state["crop"]

    return {
        "agronomy_output":
        f"Recommended fertilizer strategy for {crop}."
    }
