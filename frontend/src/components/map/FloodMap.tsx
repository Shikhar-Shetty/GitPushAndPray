import type { Coordinates, PredictionPoint } from '../../types/flood'
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import MapLegend from './MapLegend'
import PredictionLayer from './PredictionLayer'
import 'leaflet/dist/leaflet.css'

interface FloodMapProps {
  predictions: PredictionPoint[]
  loadStatus: 'idle' | 'loaded' | 'loading' | 'error'
  lastUpdated: string | null
  locationError: string | null
  selectedPredictionIndex: number
  requestedCoordinates: Coordinates | null
  onSelectPrediction: (index: number) => void
  onRequestLocation: (coordinates: Coordinates) => void
  onUseMyLocation: () => void
}

function MapClickHandler({ onRequestLocation }: Pick<FloodMapProps, 'onRequestLocation'>) {
  useMapEvents({
    click: (event) => {
      const target = event.originalEvent.target
      if (target instanceof Element && target.closest('.leaflet-interactive, .leaflet-marker-icon')) {
        return
      }

      onRequestLocation({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })
  return null
}

function MapCenterController({ requestedCoordinates }: Pick<FloodMapProps, 'requestedCoordinates'>) {
  const map = useMap()

  useEffect(() => {
    if (!requestedCoordinates) return
    map.setView([requestedCoordinates.latitude, requestedCoordinates.longitude])
  }, [requestedCoordinates, map])

  return null
}

function FloodMap({
  predictions,
  loadStatus,
  lastUpdated,
  locationError,
  selectedPredictionIndex,
  requestedCoordinates,
  onSelectPrediction,
  onRequestLocation,
  onUseMyLocation,
}: FloodMapProps) {
  const statusLabel = loadStatus === 'loading'
    ? 'Loading...'
    : loadStatus === 'error'
      ? 'Load issue'
      : loadStatus === 'loaded' ? 'Loaded' : 'Choose a location'

  return (
    <section className="panel dashboard-map" aria-labelledby="map-heading">
      <div className="panel-heading">
        <div>
          <h2 id="map-heading">Flood risk map</h2>
          <p>Choose a location to load nearby backend predictions.</p>
        </div>
        <div className="map-header-actions">
          <button className="map-location-button" type="button" onClick={onUseMyLocation}>Use my location</button>
          <span className="status-pill" style={{ '--status-color': loadStatus === 'error' ? '#a6382d' : '#0b7775', '--status-bg': loadStatus === 'error' ? '#fce9e6' : '#dcefee' } as React.CSSProperties}>
            {statusLabel}
          </span>
        </div>
      </div>
      {lastUpdated && <p className="map-updated">Last updated: {lastUpdated}</p>}
      {locationError && <p className="map-error" role="alert">{locationError}</p>}
      <div className="map-frame">
        <MapContainer
          center={[20, 0]}
          className="leaflet-map"
          scrollWheelZoom
          zoom={12}
        >
          <MapClickHandler onRequestLocation={onRequestLocation} />
          <MapCenterController requestedCoordinates={requestedCoordinates} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PredictionLayer
            predictions={predictions}
            selectedIndex={selectedPredictionIndex}
            onSelectPrediction={onSelectPrediction}
          />
        </MapContainer>
        <MapLegend />
      </div>
      {loadStatus === 'error' && <p className="map-error">Unable to load predictions for this location.</p>}
      {loadStatus === 'idle' && <p className="map-empty">Click the map or use your location to request predictions.</p>}
      {loadStatus === 'loaded' && predictions.length === 0 && <p className="map-empty">No nearby prediction areas were returned.</p>}
    </section>
  )
}

export default FloodMap
