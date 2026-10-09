import type { Coordinates, PredictionPoint } from '../types/flood'
import FloodMap from '../components/map/FloodMap'
import EmergencyContacts from '../components/emergency/EmergencyContacts'
import SOSButton from '../components/emergency/SOSButton'

interface MapPageProps {
  predictions: PredictionPoint[]
  loadStatus: 'idle' | 'loaded' | 'loading' | 'error'
  lastUpdated: string | null
  locationError: string | null
  selectedPredictionIndex: number
  requestedCoordinates: Coordinates | null
  demoMode: boolean
  onSelectPrediction: (index: number) => void
  onRequestLocation: (coordinates: Coordinates) => void
  onUseMyLocation: () => void
  onToggleDemoMode: (enabled: boolean) => void
  onViewDetails: () => void
}

function getRiskColor(probability: number): string {
  if (probability >= 0.8) return '#c4443b'
  if (probability >= 0.5) return '#d6a329'
  if (probability >= 0.25) return '#8da94a'
  return '#3c956e'
}

function getRiskLabel(probability: number): string {
  if (probability >= 0.8) return 'Critical'
  if (probability >= 0.5) return 'High'
  if (probability >= 0.25) return 'Moderate'
  return 'Low'
}

function MapPage({
  predictions,
  loadStatus,
  lastUpdated,
  locationError,
  selectedPredictionIndex,
  requestedCoordinates,
  demoMode,
  onSelectPrediction,
  onRequestLocation,
  onUseMyLocation,
  onToggleDemoMode,
  onViewDetails,
}: MapPageProps) {
  const statusLabel = loadStatus === 'loading'
    ? 'Loading…'
    : loadStatus === 'error'
      ? 'Error'
      : loadStatus === 'loaded' ? 'Live' : 'Ready'

  return (
    <div className="map-page">
      <header className="map-page-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">FI</span>
          <div>
            <p className="brand-name">Flood Intelligence</p>
            <p className="brand-context">Click the map or use your location</p>
          </div>
        </div>
        <div className="map-page-actions">
          {lastUpdated && <span className="map-page-updated">Updated {lastUpdated}</span>}
          <button
            className="demo-mode-toggle"
            type="button"
            aria-pressed={demoMode}
            onClick={() => onToggleDemoMode(!demoMode)}
          >
            <span>Demo</span>
            <span className="demo-mode-state">{demoMode ? 'ON' : 'OFF'}</span>
          </button>
          <button className="map-location-button" type="button" onClick={onUseMyLocation}>
            📍 My location
          </button>
          <span className="status-pill" style={{ '--status-color': loadStatus === 'error' ? '#ff918c' : '#70d7cf', '--status-bg': loadStatus === 'error' ? 'rgba(242, 107, 103, 0.12)' : 'rgba(78, 205, 196, 0.12)' } as React.CSSProperties}>
            {statusLabel}
          </span>
          <SOSButton />
          <EmergencyContacts />
        </div>
      </header>

      <div className="map-page-body">
        {locationError && <div className="map-page-alert" role="alert">{locationError}</div>}
        {loadStatus === 'error' && <div className="map-page-alert map-page-alert--error">Unable to load predictions for this location.</div>}

        <FloodMap
          predictions={predictions}
          selectedPredictionIndex={selectedPredictionIndex}
          requestedCoordinates={requestedCoordinates}
          onSelectPrediction={onSelectPrediction}
          onRequestLocation={onRequestLocation}
        />

        {loadStatus === 'idle' && (
          <div className="map-page-prompt">
            <span aria-hidden="true">🗺️</span>
            <p>Click anywhere on the map or use your location to get flood predictions</p>
          </div>
        )}

        {predictions.length > 0 && (
          <div className="prediction-strip">
            <div className="prediction-strip-pills">
              {predictions.map((point, index) => (
                <button
                  className={`prediction-pill${index === selectedPredictionIndex ? ' prediction-pill--active' : ''}`}
                  key={`${point.latitude}:${point.longitude}:${index}`}
                  type="button"
                  onClick={() => onSelectPrediction(index)}
                  style={{ '--pill-color': getRiskColor(point.flood_probability) } as React.CSSProperties}
                >
                  <span className="prediction-pill-dot" />
                  <span className="prediction-pill-label">
                    <strong>{getRiskLabel(point.flood_probability)}</strong>
                    <span>{(point.flood_probability * 100).toFixed(0)}%</span>
                  </span>
                </button>
              ))}
            </div>
            <button className="view-details-button" type="button" onClick={onViewDetails}>
              View Details →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage
