from functools import lru_cache
from os import environ
from pathlib import Path

import pandas as pd
import shap
import xgboost as xgb

FEATURES = [
    "Latitude",
    "Longitude",
    "Rainfall (mm)",
    "Temperature (°C)",
    "Humidity (%)",
    "Water Level (m)",
    "Elevation (m)",
]

MODEL_PATH = Path(
    environ.get(
        "FLOOD_MODEL_PATH",
        Path(__file__).resolve().parents[1] / "ml/flood_model.json",
    )
)


class ModelNotConfiguredError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _get_model_and_explainer() -> tuple[xgb.XGBClassifier, shap.TreeExplainer]:
    if not MODEL_PATH.is_file():
        raise ModelNotConfiguredError(
            f"Model artifact not found at {MODEL_PATH}. Set FLOOD_MODEL_PATH or add flood_model.json."
        )

    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
    return model, shap.TreeExplainer(model)


def _get_positive_class_shap_values(
    explainer: shap.TreeExplainer, features: pd.DataFrame
) -> list[float]:
    values = explainer(features, check_additivity=False).values
    if values.ndim == 3:
        values = values[:, :, 1]
    return [float(value) for value in values[0]]


def predict_with_explanation(data: dict):
    model, explainer = _get_model_and_explainer()
    features = pd.DataFrame([data], columns=FEATURES)

    prediction = int(model.predict(features)[0])
    probability = float(model.predict_proba(features)[0][1])
    contributions = dict(
        zip(FEATURES, _get_positive_class_shap_values(explainer, features))
    )

    return {
        "prediction": prediction,
        "flood_probability": probability,
        "shap_values": contributions
    }
