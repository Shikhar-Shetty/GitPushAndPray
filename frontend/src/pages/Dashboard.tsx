import { useEffect, useState } from 'react'
import AIBriefing from '../components/insights/AIBriefing'
import RiskFactors from '../components/insights/RiskFactors'
import SOSPanel from '../components/emergency/SOSPanel'
import DashboardLayout from '../components/layout/DashboardLayout'
import Header from '../components/layout/Header'
import FloodMap from '../components/map/FloodMap'
import PredictionCard from '../components/dashboard/PredictionCard'
import PriorityList from '../components/dashboard/PriorityList'
import RiskSummary from '../components/dashboard/RiskSummary'
import WeatherCard from '../components/dashboard/WeatherCard'
import { mockDashboardData, mockPredictionPoints } from '../data/mockData'
import { getNearbyPredictions } from '../services/api'
import type { Coordinates, PredictionPoint } from '../types/flood'

function formatUpdatedTime(): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

function Dashboard() {
  const data = mockDashboardData
  const [selectedZone, setSelectedZone] = useState(data.zones[0])
  const [requestCoordinates, setRequestCoordinates] = useState<Coordinates>(data.zones[0].coordinates)
  const [predictions, setPredictions] = useState<PredictionPoint[]>(mockPredictionPoints)
  const [predictionSource, setPredictionSource] = useState<'real' | 'mock'>('mock')
  const [selectedPredictionIndex, setSelectedPredictionIndex] = useState(0)
  const [refreshStatus, setRefreshStatus] = useState<'live' | 'updating' | 'error'>('updating')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [hasRealData, setHasRealData] = useState(false)

  const infrastructure = [
    ...new Map(
      data.zones
        .flatMap((zone) => zone.affectedInfrastructure)
        .map((point) => [point.id, point]),
    ).values(),
  ]
  const selectedPrediction = predictions[selectedPredictionIndex] ?? null

  useEffect(() => {
    const controller = new AbortController()
    let disposed = false

    async function refreshPredictions() {
      setRefreshStatus('updating')
      try {
        const response = await getNearbyPredictions(requestCoordinates.latitude, requestCoordinates.longitude, controller.signal)
        if (disposed) return
        setPredictions(response.predictions)
        setPredictionSource('real')
        setHasRealData(true)
        setSelectedPredictionIndex((index) => response.predictions.length === 0 ? 0 : Math.min(index, response.predictions.length - 1))
        setLastUpdated(formatUpdatedTime())
        setRefreshStatus('live')
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === 'AbortError')) return
        if (!hasRealData) {
          setPredictions(mockPredictionPoints)
          setPredictionSource('mock')
        }
        setRefreshStatus('error')
      }
    }

    void refreshPredictions()
    const interval = window.setInterval(() => void refreshPredictions(), 30_000)

    return () => {
      disposed = true
      controller.abort()
      window.clearInterval(interval)
    }
  }, [requestCoordinates.latitude, requestCoordinates.longitude, hasRealData])

  function handleSelectZone(zone: typeof selectedZone) {
    setSelectedZone(zone)
    setSelectedPredictionIndex(mockPredictionPoints.findIndex((point) => (
      point.latitude === zone.coordinates.latitude && point.longitude === zone.coordinates.longitude
    )))
    setRequestCoordinates(zone.coordinates)
  }

  function handleRequestLocation(coordinates: Coordinates) {
    setSelectedPredictionIndex(0)
    setRequestCoordinates(coordinates)
  }

  function handleUseMyLocation() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => handleRequestLocation({ latitude: coords.latitude, longitude: coords.longitude }),
    )
  }

  return (
    <DashboardLayout header={<Header lastUpdated={lastUpdated ?? data.lastUpdated} contacts={data.emergencyContacts} />}>
      <div className="dashboard-grid">
        <FloodMap
          zones={data.zones}
          infrastructure={infrastructure}
          predictions={predictions}
          predictionSource={predictionSource}
          refreshStatus={refreshStatus}
          lastUpdated={lastUpdated}
          selectedPredictionIndex={selectedPredictionIndex}
          selectedInfrastructureIds={selectedZone.affectedInfrastructure.map((point) => point.id)}
          selectedZoneId={selectedZone.zoneId}
          requestedCoordinates={requestCoordinates}
          onSelectZone={handleSelectZone}
          onSelectPrediction={setSelectedPredictionIndex}
          onRequestLocation={handleRequestLocation}
          onUseMyLocation={handleUseMyLocation}
        />
        <div className="dashboard-stack">
          <RiskSummary prediction={selectedPrediction} isMock={predictionSource === 'mock'} />
          <WeatherCard weather={selectedZone.weather} />
          <PredictionCard prediction={selectedPrediction} isMock={predictionSource === 'mock'} />
        </div>
      </div>
      <div className="dashboard-section dashboard-section--equal">
        <RiskFactors prediction={selectedPrediction} />
        <AIBriefing briefing={selectedZone.aiBriefing} />
      </div>
      <div className="dashboard-section dashboard-section--split">
        <div className="emergency-stack">
          <SOSPanel zone={selectedZone} />
        </div>
        <PriorityList zones={data.zones} selectedZoneId={selectedZone.zoneId} prediction={selectedPrediction} />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
