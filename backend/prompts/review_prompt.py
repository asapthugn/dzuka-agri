def get_review_prompt(
    agronomy_output: str,
    climate_output: str,
    pest_output: str,
    market_output: str
) -> str:
    return f"""
You are a senior agricultural advisor synthesizing expert reports into one action plan.

Agronomy Expert:
{agronomy_output}

Climate Expert:
{climate_output}

Pest Expert:
{pest_output}

Market Analyst:
{market_output}

Provide:
1. Summary of the situation.
2. Recommended actions.
3. Priority order.
4. Market outlook and profitability advice.
5. Final advice.

Keep the answer structured and concise.
"""
