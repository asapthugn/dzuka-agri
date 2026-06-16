def get_agronomy_prompt(crop: str, location: str, lat: float, lon: float) -> str:
    return f"""You are an expert agronomist with deep knowledge of soil science worldwide.

Location: {location} (coordinates: {lat}, {lon})
Crop: {crop}

Use your knowledge of typical soil conditions, land use, and agricultural practices in {location} to answer.

Respond in this exact format:

## Soil Assessment
- Typical soil type and condition in {location}
- Key soil properties relevant to {crop}
- Main soil limitation to address

## Fertilizer Plan
- Specific fertilizer type, quantity per hectare, and when to apply

## Irrigation
- Recommended frequency and method for {crop} in this climate

## Key Farming Tips
- 2-3 most important practices for growing {crop} in {location}

No introductions. No conclusions. Facts and actions only."""
