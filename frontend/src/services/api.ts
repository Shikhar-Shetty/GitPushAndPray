import type { AffectedFacility, FacilityResponse, PredictionResponse } from '../types/flood'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function isPredictionResponse(value: unknown): value is PredictionResponse {
  if (!value || typeof value !== 'object' || !Array.isArray((value as PredictionResponse).predictions)) {
    return false
  }

  const predictions = (value as PredictionResponse).predictions
  return predictions.length === 5 && predictions.every((point) => (
    point !== null
    && typeof point === 'object'
    && typeof point.latitude === 'number'
    && typeof point.longitude === 'number'
    && typeof point.water_level_estimate_m === 'number'
    && typeof point.prediction === 'number'
    && typeof point.flood_probability === 'number'
    && typeof point.explanation === 'string'
    && point.explanation.trim().length > 0
    && (
      point.affected_facilities === undefined
      || (
        Array.isArray(point.affected_facilities)
        && point.affected_facilities.every((facility) => (
          facility !== null
          && typeof facility === 'object'
          && typeof facility.name === 'string'
          && (facility.type === 'hospital' || facility.type === 'school')
          && typeof facility.latitude === 'number'
          && typeof facility.longitude === 'number'
        ))
      )
    )
    && point.shap_values !== null
    && typeof point.shap_values === 'object'
    && !Array.isArray(point.shap_values)
    && Object.values(point.shap_values).every((value) => typeof value === 'number')
  ))
}

function isAffectedFacility(value: unknown): value is AffectedFacility {
  return value !== null
    && typeof value === 'object'
    && typeof (value as AffectedFacility).name === 'string'
    && ((value as AffectedFacility).type === 'hospital' || (value as AffectedFacility).type === 'school')
    && typeof (value as AffectedFacility).latitude === 'number'
    && typeof (value as AffectedFacility).longitude === 'number'
}

export async function getNearbyPredictions(latitude: number, longitude: number, demoMode: boolean, signal?: AbortSignal): Promise<PredictionResponse> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Prediction coordinates are invalid.')
  }

  const response = await fetch(`${API_BASE_URL}/predict/nearby`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude, demo_mode: demoMode }),
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

export async function getNearbyFacilities(latitude: number, longitude: number, signal?: AbortSignal): Promise<FacilityResponse> {
  const response = await fetch(`${API_BASE_URL}/predict/nearby/facilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Facility request failed with status ${response.status}.`)
  }

  const payload: unknown = await response.json()
  if (
    !payload
    || typeof payload !== 'object'
    || !Array.isArray((payload as FacilityResponse).affected_facilities)
    || !(payload as FacilityResponse).affected_facilities.every(isAffectedFacility)
  ) {
    throw new Error('Facility response format is invalid.')
  }

  return payload as FacilityResponse
}
