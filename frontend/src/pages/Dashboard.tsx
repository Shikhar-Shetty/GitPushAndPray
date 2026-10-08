import { useEffect, useState } from 'react'
import AIBriefing from '../components/insights/AIBriefing'
import RiskFactors from '../components/insights/RiskFactors'
import DashboardLayout from '../components/layout/DashboardLayout'
import Header from '../components/layout/Header'
import FloodMap from '../components/map/FloodMap'
import PredictionCard from '../components/dashboard/PredictionCard'
import PriorityList from '../components/dashboard/PriorityList'
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
  const [requestCoordinates, setRequestCoordinates] = useState<Coordinates | null>(null)
  const [predictions, setPredictions] = useState<PredictionPoint[]>([])
  const [selectedPredictionIndex, setSelectedPredictionIndex] = useState(0)
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loaded' | 'loading' | 'error'>('idle')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const selectedPrediction = predictions[selectedPredictionIndex] ?? null

  useEffect(() => {
    if (!requestCoordinates) return
    const coordinates = requestCoordinates

    const controller = new AbortController()
    let disposed = false

    async function loadPredictions() {
      setLoadStatus('loading')
      try {
        const response = await getNearbyPredictions(coordinates.latitude, coordinates.longitude, controller.signal)
        if (disposed) return
        setPredictions(response.predictions)
        setSelectedPredictionIndex((index) => response.predictions.length === 0 ? 0 : Math.min(index, response.predictions.length - 1))
        setLastUpdated(formatUpdatedTime())
        setLoadStatus('loaded')
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === 'AbortError')) return
        setPredictions([])
        setLoadStatus('error')
      }
    }

    void loadPredictions()

    return () => {
      disposed = true
      controller.abort()
    }
  }, [requestCoordinates])

  function handleRequestLocation(coordinates: Coordinates) {
    setLocationError(null)
    setSelectedPredictionIndex(0)
    setRequestCoordinates(coordinates)
  }

  function handleUseMyLocation() {
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError('Location is unavailable in this browser. Select a location on the map instead.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => handleRequestLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Select a location on the map instead.'
          : error.code === error.POSITION_UNAVAILABLE
            ? 'Your location is unavailable right now. Select a location on the map instead.'
            : 'Location request timed out. Select a location on the map instead.'
        setLocationError(message)
      },
    )
  }

  return (
    <DashboardLayout header={<Header lastUpdated={lastUpdated ?? 'Choose a location'} />}>
      <div className="dashboard-grid">
        <FloodMap
          predictions={predictions}
          loadStatus={loadStatus}
          lastUpdated={lastUpdated}
          locationError={locationError}
          selectedPredictionIndex={selectedPredictionIndex}
          requestedCoordinates={requestCoordinates}
          onSelectPrediction={setSelectedPredictionIndex}
          onRequestLocation={handleRequestLocation}
          onUseMyLocation={handleUseMyLocation}
        />
        <div className="dashboard-stack">
          <PredictionCard prediction={selectedPrediction} isMock={false} />
        </div>
      </div>
      <div className="dashboard-section dashboard-section--equal">
        <RiskFactors prediction={selectedPrediction} />
        <AIBriefing briefing={selectedPrediction?.explanation ?? ''} isMock={false} />
      </div>
      <div className="dashboard-section dashboard-section--split">
        <PriorityList
          predictions={predictions}
          selectedPredictionIndex={selectedPredictionIndex}
          onSelectPrediction={setSelectedPredictionIndex}
        />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
