import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

import sys

if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY is not set. (Optional if only using Groq)", file=sys.stderr)
