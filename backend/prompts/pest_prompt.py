def get_pest_prompt(crop: str, symptoms: str, region: str) -> str:
    symptoms_text = symptoms.strip() if symptoms and symptoms.strip() else "No symptoms reported — provide general pest and disease prevention advice for this crop and region."
    return f"""You are a plant pathologist. Be concise and actionable only.

Region: {region}
Crop: {crop}
Symptoms: {symptoms_text}

Respond in this exact format:

## Diagnosis
- Most likely disease or pest for {crop} in {region} based on the symptoms (1-2 options max)

## Cause
- Brief reason why this is occurring in this region/season

## Treatment
- Organic option: specific product/method
- Chemical option: specific product/method

## Prevention
- 1-2 preventive measures for next season in {region}

No introductions. No conclusions. Facts and actions only."""
