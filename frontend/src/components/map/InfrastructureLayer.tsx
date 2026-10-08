import type { InfrastructurePoint } from '../../types/flood'
import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

interface InfrastructureLayerProps {
  points: InfrastructurePoint[]
  selectedPointIds: string[]
}

const markerLabels = {
  hospital: 'H',
  shelter: 'S',
  rescue: 'R',
  public: 'P',
} as const

const markerTitles = {
  hospital: 'Hospital',
  shelter: 'Shelter',
  rescue: 'Rescue facility',
  public: 'Public facility',
} as const

function InfrastructureLayer({ points, selectedPointIds }: InfrastructureLayerProps) {
  return (
    <>
      {points.map((point) => {
        const isSelected = selectedPointIds.includes(point.id)
        const icon = divIcon({
          className: `infrastructure-icon infrastructure-icon--${point.type}${isSelected ? ' infrastructure-icon--selected' : ''}`,
          html: `<span aria-hidden="true">${markerLabels[point.type]}</span>`,
          iconAnchor: [15, 15],
          iconSize: [30, 30],
          popupAnchor: [0, -15],
        })

        return (
          <Marker
            icon={icon}
          key={point.id}
            position={[point.coordinates.latitude, point.coordinates.longitude]}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {markerTitles[point.type]} · demo location
              <br />
              Status: {point.status}
              <br />
              Priority: {point.priority === 0 ? 'Immediate' : point.priority}
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default InfrastructureLayer