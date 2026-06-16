def get_agronomy_prompt(crop: str, soil_data: dict, region: str) -> str:
    return f"""You are an expert agronomist. Be concise and actionable only.

Region: {region}
Crop: {crop}
Soil Data: {soil_data}

Respond in this exact format:

## Soil Assessment
- 2-3 bullet points about the soil condition in {region}

## Fertilizer Plan
- Specific type, quantity, and timing (e.g. "Apply 50kg/ha Urea at planting")

## Irrigation
- Frequency and amount based on the soil moisture data above

## Key Farming Tips
- 2-3 most important practices for {crop} in {region}

No introductions. No conclusions. Facts and actions only."""
