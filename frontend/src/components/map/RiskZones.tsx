import type { FloodZone } from '../../types/flood'

interface RiskZonesProps {
  zones: FloodZone[]
}

const zoneColors = {
  low: ['#4b9f91', 'rgba(75, 159, 145, 0.22)'],
  moderate: ['#d19a35', 'rgba(209, 154, 53, 0.25)'],
  high: ['#db6b3f', 'rgba(219, 107, 63, 0.25)'],
  critical: ['#bd493a', 'rgba(189, 73, 58, 0.28)'],
} as const

function RiskZones({ zones }: RiskZonesProps) {
  return (
    <div aria-label="Flood risk zones">
      {zones.map((zone) => {
        const [color, fill] = zoneColors[zone.riskLevel]
        return (
          <div
            className="map-zone"
            key={zone.id}
            style={{ '--zone-color': color, '--zone-fill': fill } as React.CSSProperties}
          >
            {zone.name}
          </div>
        )
      })}
    </div>
  )
}

export default RiskZones