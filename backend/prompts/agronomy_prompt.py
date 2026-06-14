def get_agronomy_prompt(crop: str, soil_data: list) -> str:
    return f"""
You are an agricultural expert specializing in crop management.

Crop: {crop}

Soil Data:
{soil_data}

Provide:
1. Best farming practices for this crop given the soil data.
2. Fertilizer recommendations (type, quantity, timing).
3. Irrigation recommendations.
4. Optimal planting season and spacing.

Keep the answer concise and practical.
"""
