def get_climate_prompt(lat: float, lon: float, weather_data: dict | list, location: str) -> str:
    return f"""You are a climate advisor for agriculture.

Location: {location} (coordinates: {lat}, {lon})
Live Weather Data: {weather_data}

Respond in this exact format:

## Current Conditions in {location}
- Temperature, rainfall, and humidity from the live data above

## Climate Risks
- Top 2 risks for farming in {location} this season

## Irrigation Advice
- Specific recommendation based on the rainfall data

## Best Planting Window
- Best months to plant crops in {location} based on its climate

No introductions. No conclusions. Facts and actions only."""
