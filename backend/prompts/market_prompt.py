def get_market_prompt(crop: str, market_data: list) -> str:
    return f"""
You are an agricultural market analyst.

Crop: {crop}

Current Market Data:
{market_data}

Provide:
1. Current market price analysis.
2. Demand outlook.
3. Best time and region to sell.
4. Profitability recommendation.

Keep the answer concise.
"""
