import type { FloodZone, InfrastructurePoint } from '../../types/flood'
import type { Coordinates, PredictionPoint } from '../../types/flood'
import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import InfrastructureLayer from './InfrastructureLayer'
import MapLegend from './MapLegend'
import PredictionLayer from './PredictionLayer'
import RiskZones from './RiskZones'
import 'leaflet/dist/leaflet.css'

interface FloodMapProps {
  zones: FloodZone[]
  infrastructure: InfrastructurePoint[]
  predictions: PredictionPoint[]
  predictionSource: 'real' | 'mock'
  refreshStatus: 'live' | 'updating' | 'error'
  lastUpdated: string | null
  selectedPredictionIndex: number
  requestedCoordinates: Coordinates
  selectedInfrastructureIds: string[]
  selectedZoneId: string
  onSelectZone: (zone: FloodZone) => void
  onSelectPrediction: (index: number) => void
  onRequestLocation: (coordinates: Coordinates) => void
  onUseMyLocation: () => void
}

function MapClickHandler({ onRequestLocation }: Pick<FloodMapProps, 'onRequestLocation'>) {
  useMapEvents({
    click: (event) => onRequestLocation({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
  })
  return null
}

function MapCenterController({ requestedCoordinates }: Pick<FloodMapProps, 'requestedCoordinates'>) {
  const map = useMap()

  useEffect(() => {
    map.setView([requestedCoordinates.latitude, requestedCoordinates.longitude])
  }, [requestedCoordinates.latitude, requestedCoordinates.longitude, map])

  return null
}

function FloodMap({
  zones,
  infrastructure,
  predictions,
  predictionSource,
  refreshStatus,
  lastUpdated,
  selectedPredictionIndex,
  requestedCoordinates,
  selectedInfrastructureIds,
  selectedZoneId,
  onSelectZone,
  onSelectPrediction,
  onRequestLocation,
  onUseMyLocation,
}: FloodMapProps) {
  const statusLabel = refreshStatus === 'updating'
    ? 'Updating...'
    : refreshStatus === 'error'
      ? 'Update issue'
      : predictionSource === 'real' ? 'Live' : 'Demo fallback'

  return (
    <section className="panel dashboard-map" aria-labelledby="map-heading">
      <div className="panel-heading">
        <div>
          <h2 id="map-heading">Flood risk map</h2>
          <p>{predictionSource === 'real' ? 'Nearby backend prediction points.' : 'Demo fallback prediction points.'}</p>
        </div>
        <div className="map-header-actions">
          <button className="map-location-button" type="button" onClick={onUseMyLocation}>Use my location</button>
          <span className="status-pill" style={{ '--status-color': predictionSource === 'real' ? '#0b7775' : '#946b16', '--status-bg': predictionSource === 'real' ? '#dcefee' : '#fff3d8' } as React.CSSProperties}>
            {statusLabel}
          </span>
        </div>
      </div>
      {lastUpdated && <p className="map-updated">Last updated: {lastUpdated}</p>}
      <div className="map-frame">
        <MapContainer
          center={[12.9141, 74.8560]}
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
          {predictionSource === 'mock' ? (
            <RiskZones
              zones={zones}
              selectedZoneId={selectedZoneId}
              onSelectZone={onSelectZone}
            />
          ) : (
            <PredictionLayer
              predictions={predictions}
              selectedIndex={selectedPredictionIndex}
              onSelectPrediction={onSelectPrediction}
            />
          )}
          <InfrastructureLayer points={infrastructure} selectedPointIds={selectedInfrastructureIds} />
          <CircleMarker
            center={[requestedCoordinates.latitude, requestedCoordinates.longitude]}
            pathOptions={{ color: '#18343a', fillColor: '#fff', fillOpacity: 1, weight: 2, dashArray: '4 4' }}
            radius={7}
          >
            <Popup>Requested prediction location</Popup>
          </CircleMarker>
        </MapContainer>
        <MapLegend />
      </div>
      {refreshStatus === 'error' && <p className="map-error">Unable to update - showing the last available result.</p>}
      {predictionSource === 'real' && predictions.length === 0 && <p className="map-empty">No nearby prediction areas were returned.</p>}
    </section>
  )
}

export default FloodMap