def get_review_prompt(
    agronomy_output: str,
    climate_output: str,
    pest_output: str,
    market_output: str
) -> str:
    return f"""You are a senior agricultural advisor. Synthesize the expert reports below into one clear action plan.

AGRONOMY: {agronomy_output}
CLIMATE: {climate_output}
PEST: {pest_output}
MARKET: {market_output}

Respond in this exact format:

## Situation Summary
2-3 sentences describing the farm's current situation.

## Priority Actions
1. Most urgent action
2. Second action
3. Third action
4. Fourth action
5. Fifth action

## Market Opportunity
1-2 sentences on best selling strategy right now.

## Final Advice
One clear closing recommendation the farmer should act on this week.

Be specific, practical, and brief. No repetition from individual reports."""
