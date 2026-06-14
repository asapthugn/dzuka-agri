from langgraph.graph import StateGraph, START, END

from graph.state import DzukaState

from agents.master_orchestrator import master_orchestrator
from agents.agronomy_agent import agronomy_agent
from agents.climate_agent import climate_agent
from agents.pest_agent import pest_agent
from agents.review_agent import review_agent

workflow = StateGraph(DzukaState)

# Nodes
workflow.add_node("master", master_orchestrator)
workflow.add_node("agronomy", agronomy_agent)
workflow.add_node("climate", climate_agent)
workflow.add_node("pest", pest_agent)
workflow.add_node("review", review_agent)

# Edges
workflow.add_edge(START, "master")

workflow.add_edge("master", "agronomy")
workflow.add_edge("agronomy", "climate")
workflow.add_edge("climate", "pest")
workflow.add_edge("pest", "review")
workflow.add_edge("review", END)

app = workflow.compile()