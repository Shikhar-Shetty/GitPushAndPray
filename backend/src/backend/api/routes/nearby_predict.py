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
from backend.services.overpass import FacilityServiceError, fetch_nearby_facilities
from backend.services.shap import ModelNotConfiguredError, predict_with_explanation

router = APIRouter()


class NearbyPredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    latitude: float
    longitude: float


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
            prediction = {
                "latitude": item["Latitude"],
                "longitude": item["Longitude"],
                "water_level_estimate_m": item["water_level_estimate_m"],
                **predict_with_explanation(item),
            }
            prediction["affected_facilities"] = (
                await fetch_nearby_facilities(
                    prediction["latitude"], prediction["longitude"]
                )
                if prediction["prediction"] == 1
                else []
            )
            prediction["explanation"] = await explain_prediction(prediction)
            predictions.append(prediction)
    except ModelNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except GroqConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except GroqServiceError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    except FacilityServiceError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    return {"predictions": predictions}
