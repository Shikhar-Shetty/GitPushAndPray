import type { Coordinates, PredictionPoint } from '../../types/flood'
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import MapLegend from './MapLegend'
import PredictionLayer from './PredictionLayer'
import 'leaflet/dist/leaflet.css'

interface FloodMapProps {
  predictions: PredictionPoint[]
  selectedPredictionIndex: number
  requestedCoordinates: Coordinates | null
  onSelectPrediction: (index: number) => void
  onRequestLocation: (coordinates: Coordinates) => void
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
  selectedPredictionIndex,
  requestedCoordinates,
  onSelectPrediction,
  onRequestLocation,
}: FloodMapProps) {
  return (
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
  )
}

export default FloodMap
