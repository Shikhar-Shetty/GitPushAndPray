export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface WeatherSnapshot {
  location: string
  temperatureCelsius: number
  rainfallMillimeters: number
  precipitationMillimeters: number
  windKilometersPerHour: number
  condition: string
  weatherStatus: 'normal' | 'watch' | 'warning'
  observedAt: string
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  description: string
}

export interface RiskFactor {
  label: string
  contribution: number
}

export type ShapValues = Record<string, number>

export interface PredictionPoint {
  latitude: number
  longitude: number
  water_level_estimate_m: number
  prediction: number
  flood_probability: number
  shap_values: ShapValues
}

export interface PredictionResponse {
  predictions: PredictionPoint[]
}

export interface InfrastructurePoint {
  id: string
  name: string
  type: 'hospital' | 'shelter' | 'rescue' | 'public'
  status: 'operational' | 'monitor' | 'at-risk'
  priority: number
  distanceKilometers: number
  zoneIds: string[]
  coordinates: Coordinates
}

export interface FloodZone {
  zoneId: string
  zoneName: string
  riskLevel: RiskLevel
  riskProbability: number
  severity: string
  expectedOnset: string
  expectedPeak: string
  riskFactors: RiskFactor[]
  aiBriefing: string
  affectedInfrastructure: InfrastructurePoint[]
  priority: number
  emergencyStatus: 'monitoring' | 'elevated' | 'urgent' | 'critical'
  recommendedAction: string
  coordinates: Coordinates
  weather: WeatherSnapshot
}

export interface DashboardData {
  lastUpdated: string
  zones: FloodZone[]
  emergencyContacts: EmergencyContact[]
}
