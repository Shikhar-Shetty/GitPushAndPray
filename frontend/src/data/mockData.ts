import type { DashboardData, FloodZone, InfrastructurePoint } from '../types/flood'

const infrastructure = {
  districtHospital: {
    id: 'facility-district-hospital',
    name: 'District Hospital',
    category: 'hospital',
    coordinates: { latitude: 12.8996, longitude: 74.8420 },
  },
  centralShelter: {
    id: 'facility-central-shelter',
    name: 'Central Relief Shelter',
    category: 'shelter',
    coordinates: { latitude: 12.9220, longitude: 74.8501 },
  },
  nh66Underpass: {
    id: 'facility-nh66-underpass',
    name: 'NH 66 underpass',
    category: 'road',
    coordinates: { latitude: 12.9364, longitude: 74.8323 },
  },
  portFerryRoad: {
    id: 'facility-port-ferry-road',
    name: 'Port ferry access road',
    category: 'road',
    coordinates: { latitude: 12.8728, longitude: 74.8422 },
  },
} satisfies Record<string, InfrastructurePoint>

export const mockFloodZones: FloodZone[] = [
  {
    zoneId: 'zone-mangaluru-east',
    zoneName: 'Mangaluru East',
    riskLevel: 'high',
    riskProbability: 78,
    severity: 'Severe flooding possible',
    expectedOnset: 'Within 6 hours',
    expectedPeak: '18:00 - 21:00 IST',
    riskFactors: [
      { label: 'Heavy rainfall', contribution: 0.31 },
      { label: 'Historical flood risk', contribution: 0.24 },
      { label: 'Low terrain elevation', contribution: 0.16 },
      { label: 'River level', contribution: 0.12 },
    ],
    aiBriefing: 'Rainfall is intensifying over low-lying eastern wards. Prepare to move vulnerable residents from Mangaluru East first and keep the NH 66 underpass under observation as water levels rise.',
    affectedInfrastructure: [infrastructure.nh66Underpass, infrastructure.centralShelter],
    priority: 1,
    coordinates: { latitude: 12.9141, longitude: 74.8560 },
    weather: {
      location: 'Mangaluru East',
      temperatureCelsius: 28,
      rainfallMillimeters: 42,
      windKilometersPerHour: 18,
      condition: 'Heavy rain nearby',
      observedAt: '09:30 IST',
    },
  },
  {
    zoneId: 'zone-port-ward',
    zoneName: 'Port Ward',
    riskLevel: 'critical',
    riskProbability: 91,
    severity: 'Critical flooding likely',
    expectedOnset: 'Within 3 hours',
    expectedPeak: '16:00 - 19:00 IST',
    riskFactors: [
      { label: 'Coastal surge exposure', contribution: 0.38 },
      { label: 'Heavy rainfall', contribution: 0.29 },
      { label: 'Drainage capacity', contribution: 0.18 },
      { label: 'High tide timing', contribution: 0.09 },
    ],
    aiBriefing: 'Port Ward is the highest-priority mock risk area. Review evacuation routes now, protect the ferry access road, and keep the district hospital route clear for emergency movement.',
    affectedInfrastructure: [infrastructure.districtHospital, infrastructure.portFerryRoad],
    priority: 0,
    coordinates: { latitude: 12.8728, longitude: 74.8422 },
    weather: {
      location: 'Port Ward',
      temperatureCelsius: 27,
      rainfallMillimeters: 58,
      windKilometersPerHour: 24,
      condition: 'Intense coastal rain',
      observedAt: '09:30 IST',
    },
  },
  {
    zoneId: 'zone-kuloor',
    zoneName: 'Kuloor Corridor',
    riskLevel: 'moderate',
    riskProbability: 54,
    severity: 'Localized flooding possible',
    expectedOnset: 'Within 12 hours',
    expectedPeak: '20:00 - 23:00 IST',
    riskFactors: [
      { label: 'Recent rainfall', contribution: 0.22 },
      { label: 'River level', contribution: 0.19 },
      { label: 'Soil saturation', contribution: 0.14 },
      { label: 'Road drainage', contribution: 0.11 },
    ],
    aiBriefing: 'Kuloor Corridor remains a moderate mock risk. Monitor river levels, keep the shelter route accessible, and reassess if rainfall persists through the afternoon.',
    affectedInfrastructure: [infrastructure.centralShelter, infrastructure.nh66Underpass],
    priority: 2,
    coordinates: { latitude: 12.9484, longitude: 74.8312 },
    weather: {
      location: 'Kuloor Corridor',
      temperatureCelsius: 29,
      rainfallMillimeters: 24,
      windKilometersPerHour: 14,
      condition: 'Steady rain',
      observedAt: '09:30 IST',
    },
  },
]

export const mockDashboardData: DashboardData = {
  lastUpdated: '08 Oct 2026, 09:42 IST',
  zones: mockFloodZones,
}
