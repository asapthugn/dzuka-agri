def get_market_prompt(crop: str, location: str, lat: float, lon: float) -> str:
    return f"""You are an agricultural market analyst with knowledge of crop prices worldwide.

Location: {location} (coordinates: {lat}, {lon})
Crop: {crop}

Use your knowledge of current agricultural markets, typical prices, and demand patterns in {location} and nearby markets.

Respond in this exact format:

## Current Price in {location}
- Estimated price per kg and current demand level

## Market Outlook
- 1-2 sentences on price trend for {crop} in this region

## Best Selling Strategy
- When and where to sell for maximum profit near {location}

## Profitability
- Simple estimate of production cost vs expected return per hectare

No introductions. No conclusions. Facts and actions only."""
