import json
from os import environ
from pathlib import Path

import httpx
from dotenv import load_dotenv

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
load_dotenv(Path(__file__).resolve().parents[3] / ".env", override=False)
GROQ_MODEL = environ.get("GROQ_MODEL", "qwen/qwen3.8-27b")


class GroqConfigurationError(RuntimeError):
    pass


class GroqServiceError(RuntimeError):
    pass


async def explain_prediction(prediction: dict) -> str:
    api_key = environ.get("GROQ_API_KEY")
    if not api_key:
        raise GroqConfigurationError("GROQ_API_KEY is not configured")

    prompt = {
        "location": {
            "latitude": prediction["latitude"],
            "longitude": prediction["longitude"],
        },
        "prediction": prediction["prediction"],
        "flood_probability": prediction["flood_probability"],
        "water_level_estimate_m": prediction["water_level_estimate_m"],
        "shap_values": prediction["shap_values"],
    }

    messages = [
        {
            "role": "system",
            "content": (
                "Explain a flood prediction to a non-technical user in 2-3 concise sentences. "
                "Use only the supplied data. Mention the strongest factors and whether the risk "
                "is low, moderate, or high. And what other factors are actually causing this"
            ),
        },
        {"role": "user", "content": json.dumps(prompt)},
    ]

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": messages,
                    "temperature": 0.2,
                    "max_tokens": 160,
                },
            )
            response.raise_for_status()
            payload = response.json()
            explanation = payload["choices"][0]["message"]["content"]
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as error:
        raise GroqServiceError("Unable to generate a prediction explanation") from error

    if not isinstance(explanation, str) or not explanation.strip():
        raise GroqServiceError("Groq returned an empty prediction explanation")

    return explanation.strip()