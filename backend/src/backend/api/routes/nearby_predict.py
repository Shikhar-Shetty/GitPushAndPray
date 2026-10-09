from math import isfinite
from os import environ

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from backend.services.groq import (
    GroqConfigurationError,
    GroqServiceError,
    explain_prediction,
)
from backend.services.open_meteo import (
    WeatherServiceError,
    fetch_weather,
    nearby_coordinates,
)
from backend.services.shap import ModelNotConfiguredError, predict_with_explanation

router = APIRouter()
DEMO_FEATURE_MULTIPLIER = float(environ.get("DEMO_FEATURE_MULTIPLIER", "2.0"))
if not isfinite(DEMO_FEATURE_MULTIPLIER) or DEMO_FEATURE_MULTIPLIER <= 1:
    raise ValueError("DEMO_FEATURE_MULTIPLIER must be a finite number greater than 1")

DEMO_FEATURES = ("Rainfall (mm)", "Water Level (m)")


class NearbyPredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    latitude: float
    longitude: float
    demo_mode: bool = False


def prepare_model_features(weather: dict[str, float], demo_mode: bool) -> dict[str, float]:
    features = weather.copy()
    if demo_mode:
        for feature in DEMO_FEATURES:
            features[feature] *= DEMO_FEATURE_MULTIPLIER
    return features


@router.post("/predict/nearby")
async def predict_nearby(data: NearbyPredictionRequest):
    locations = nearby_coordinates(data.latitude, data.longitude)

    try:
        weather = await fetch_weather(locations)
    except WeatherServiceError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    try:
        predictions = []
        for item in weather:
            model_features = prepare_model_features(item, data.demo_mode)
            prediction = {
                "latitude": item["Latitude"],
                "longitude": item["Longitude"],
                "water_level_estimate_m": item["water_level_estimate_m"],
                "demo_mode": data.demo_mode,
                "demo_multiplier": DEMO_FEATURE_MULTIPLIER if data.demo_mode else None,
                **predict_with_explanation(model_features),
            }
            prediction["explanation"] = await explain_prediction(prediction)
            predictions.append(prediction)
    except ModelNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except GroqConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except GroqServiceError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    return {"predictions": predictions}
