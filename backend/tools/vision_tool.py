import base64
from services.openai_service import client


def analyze_crop_image(image_bytes: bytes, crop: str) -> str:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"You are a plant pathology expert. "
                            f"Analyze this image of a {crop} plant and identify:\n"
                            "1. Visible diseases or pest damage.\n"
                            "2. Nutrient deficiencies.\n"
                            "3. Treatment recommendations.\n"
                            "Be concise and practical."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=500
    )

    return response.choices[0].message.content
