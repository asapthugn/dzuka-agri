from graph.workflow import app

initial_state = {
    "crop": "maize",
    "symptoms": "yellow leaves",
    "latitude": -6.9,
    "longitude": 107.6,
    "task": "diagnose"
}

result = app.invoke(initial_state)

print(result["final_recommendation"])