import type { InfrastructurePoint } from '../../types/flood'

interface InfrastructureLayerProps {
  points: InfrastructurePoint[]
}

const markerColors = {
  hospital: '#bd493a',
  shelter: '#0b7775',
  road: '#526d73',
} as const

function InfrastructureLayer({ points }: InfrastructureLayerProps) {
  return (
    <div className="map-infrastructure" aria-label="Infrastructure locations">
      {points.map((point) => (
        <span
          className="map-marker"
          key={point.id}
          title={point.name}
          style={{ '--marker-color': markerColors[point.category] } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default InfrastructureLayer