from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from backend.services.shap import (
    FEATURES,
    ModelNotConfiguredError,
    predict_with_explanation,
)

router = APIRouter()


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    latitude: float = Field(alias="Latitude")
    longitude: float = Field(alias="Longitude")
    rainfall: float = Field(alias="Rainfall (mm)")
    temperature: float = Field(alias="Temperature (°C)")
    humidity: float = Field(alias="Humidity (%)")
    water_level: float = Field(alias="Water Level (m)")
    elevation: float = Field(alias="Elevation (m)")


@router.post("/predict")
def predict(data: PredictionRequest):
    values = data.model_dump(by_alias=True)
    missing_features = set(FEATURES) - values.keys()
    if missing_features:
        raise HTTPException(status_code=422, detail="Missing prediction features")

    try:
        return predict_with_explanation(values)
    except ModelNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
