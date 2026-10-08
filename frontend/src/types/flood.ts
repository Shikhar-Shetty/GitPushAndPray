export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface WeatherSnapshot {
  location: string
  temperatureCelsius: number
  rainfallMillimeters: number
  windKilometersPerHour: number
  condition: string
  observedAt: string
}

export interface RiskFactor {
  label: string
  contribution: number
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
}
