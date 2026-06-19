def get_pest_prompt(crop: str, symptoms: str, location: str) -> str:
    symptoms_text = (
        symptoms.strip()
        if symptoms and symptoms.strip()
        else "No symptoms reported — provide general pest and disease prevention advice for this crop and region."
    )
    return f"""You are a plant pathologist with knowledge of crop diseases worldwide.

Location: {location}
Crop: {crop}
Symptoms: {symptoms_text}

Use your knowledge of common pests and diseases for {crop} in {location} and its climate.

Respond in this exact format:

## Diagnosis
- Most likely disease or pest based on symptoms and region (1-2 options)

## Cause
- Why this is occurring in {location} at this time

## Treatment
- Organic option: specific product or method
- Chemical option: specific product or method

## Prevention
- 1-2 preventive measures for next season in {location}

No introductions. No conclusions. Facts and actions only."""
