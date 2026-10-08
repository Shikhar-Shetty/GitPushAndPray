export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface FloodZone {
  id: string
  name: string
  riskLevel: RiskLevel
  probability: number
  severity: string
  onset: string
  peak: string
  coordinates: Coordinates
}

export interface WeatherSnapshot {
  location: string
  temperatureCelsius: number
  rainfallMillimeters: number
  windKilometersPerHour: number
  condition: string
  observedAt: string
}

export interface PredictionSummary {
  severity: string
  onset: string
  peak: string
  confidence: number
}

export interface RiskFactor {
  label: string
  contribution: number
}

export interface PriorityItem {
  id: string
  name: string
  detail: string
  riskLevel: RiskLevel
}

export interface InfrastructurePoint {
  id: string
  name: string
  category: 'hospital' | 'shelter' | 'road'
  coordinates: Coordinates
}

export interface DashboardData {
  lastUpdated: string
  selectedZone: FloodZone
  zones: FloodZone[]
  weather: WeatherSnapshot
  prediction: PredictionSummary
  riskFactors: RiskFactor[]
  priorityItems: PriorityItem[]
  infrastructure: InfrastructurePoint[]
  briefing: string
}