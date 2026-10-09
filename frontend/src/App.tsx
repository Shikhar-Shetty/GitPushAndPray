import { useEffect, useState } from 'react'
import './App.css'
import OnboardingPage from './pages/OnboardingPage'
import MapPage from './pages/MapPage'
import DetailsPage from './pages/DetailsPage'
import { getNearbyPredictions } from './services/api'
import type { Coordinates, PredictionPoint } from './types/flood'

function formatUpdatedTime(): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

type Page = 'onboarding' | 'map' | 'details'

function App() {
  const [page, setPage] = useState<Page>('onboarding')

  // Global state previously in Dashboard
  const [requestCoordinates, setRequestCoordinates] = useState<Coordinates | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [predictions, setPredictions] = useState<PredictionPoint[]>([])
  const [selectedPredictionIndex, setSelectedPredictionIndex] = useState(0)
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loaded' | 'loading' | 'error'>('idle')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    if (!requestCoordinates) return
    const coordinates = requestCoordinates

    const controller = new AbortController()
    let disposed = false

    async function loadPredictions() {
      setLoadStatus('loading')
      try {
        const response = await getNearbyPredictions(coordinates.latitude, coordinates.longitude, demoMode, controller.signal)
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
  }, [requestCoordinates, demoMode])

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
    <div className="app-root">
      {page === 'onboarding' && (
        <OnboardingPage onGetStarted={() => setPage('map')} />
      )}
      {page === 'map' && (
        <MapPage
          predictions={predictions}
          loadStatus={loadStatus}
          lastUpdated={lastUpdated}
          locationError={locationError}
          selectedPredictionIndex={selectedPredictionIndex}
          requestedCoordinates={requestCoordinates}
          demoMode={demoMode}
          onSelectPrediction={setSelectedPredictionIndex}
          onRequestLocation={handleRequestLocation}
          onUseMyLocation={handleUseMyLocation}
          onToggleDemoMode={setDemoMode}
          onViewDetails={() => setPage('details')}
        />
      )}
      {page === 'details' && (
        <DetailsPage
          predictions={predictions}
          selectedPredictionIndex={selectedPredictionIndex}
          lastUpdated={lastUpdated}
          onSelectPrediction={setSelectedPredictionIndex}
          onBack={() => setPage('map')}
        />
      )}
    </div>
  )
}

export default App
