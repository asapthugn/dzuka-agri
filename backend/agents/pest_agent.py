from graph.state import DzukaState


def pest_agent(state: DzukaState):

    symptoms = state["symptoms"]

    return {
        "pest_output":
        f"Possible nitrogen deficiency based on symptoms: {symptoms}"
    }