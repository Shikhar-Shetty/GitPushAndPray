import type { PredictionResponse } from '../types/flood'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function isPredictionResponse(value: unknown): value is PredictionResponse {
  if (!value || typeof value !== 'object' || !Array.isArray((value as PredictionResponse).predictions)) {
    return false
  }

  return (value as PredictionResponse).predictions.every((point) => (
    point !== null
    && typeof point === 'object'
    && typeof point.latitude === 'number'
    && typeof point.longitude === 'number'
    && typeof point.water_level_estimate_m === 'number'
    && typeof point.prediction === 'number'
    && typeof point.flood_probability === 'number'
    && point.shap_values !== null
    && typeof point.shap_values === 'object'
    && Object.values(point.shap_values).every((value) => typeof value === 'number')
  ))
}

export async function getNearbyPredictions(latitude: number, longitude: number, signal?: AbortSignal): Promise<PredictionResponse> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Prediction coordinates are invalid.')
  }

  const response = await fetch(`${API_BASE_URL}/predict/nearby`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}.`)
  }

  const payload: unknown = await response.json()
  if (!isPredictionResponse(payload)) {
    throw new Error('Prediction response format is invalid.')
  }

  return payload
}