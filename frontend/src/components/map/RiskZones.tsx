import type { FloodZone } from '../../types/flood'
import { Circle, Popup } from 'react-leaflet'

interface RiskZonesProps {
  zones: FloodZone[]
  selectedZoneId: string
  onSelectZone: (zone: FloodZone) => void
}

const zoneColors = {
  low: ['#4b9f91', 'rgba(75, 159, 145, 0.22)'],
  medium: ['#d19a35', 'rgba(209, 154, 53, 0.25)'],
  high: ['#db6b3f', 'rgba(219, 107, 63, 0.25)'],
  critical: ['#bd493a', 'rgba(189, 73, 58, 0.28)'],
} as const

function RiskZones({ zones, selectedZoneId, onSelectZone }: RiskZonesProps) {
  return (
    <>
      {zones.map((zone) => {
        const [color, fill] = zoneColors[zone.riskLevel]
        const isSelected = zone.zoneId === selectedZoneId
        return (
          <Circle
            center={[zone.coordinates.latitude, zone.coordinates.longitude]}
            eventHandlers={{ click: () => onSelectZone(zone) }}
            key={zone.zoneId}
            pathOptions={{
              color,
              fillColor: fill,
              fillOpacity: isSelected ? 0.55 : 0.35,
              weight: isSelected ? 4 : 2,
            }}
            radius={isSelected ? 720 : 570}
          >
            <Popup>
              <strong>{zone.zoneName}</strong>
              <br />
              {zone.riskProbability}% mock flood probability
            </Popup>
          </Circle>
        )
      })}
    </>
  )
}

export default RiskZones