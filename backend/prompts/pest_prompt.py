def get_pest_prompt(crop: str, symptoms: str) -> str:
    return f"""
You are a plant pathology and pest control expert.

Crop: {crop}

Observed Symptoms:
{symptoms}

Identify:
1. Possible diseases, pests, or nutrient deficiencies.
2. Most likely causes.
3. Treatment recommendations (organic and chemical options).
4. Preventive measures for the future.

Keep the answer concise and actionable.
"""
