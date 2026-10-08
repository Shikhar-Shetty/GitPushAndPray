import type { RiskLevel } from '../../types/flood'

const legendItems: Array<{ label: string; level: RiskLevel; color: string }> = [
  { label: 'Critical', level: 'critical', color: '#bd493a' },
  { label: 'High', level: 'high', color: '#db6b3f' },
  { label: 'Moderate', level: 'moderate', color: '#d19a35' },
]

function MapLegend() {
  return (
    <div className="map-legend" aria-label="Flood risk legend">
      <ul>
        {legendItems.map((item) => (
          <li key={item.level}>
            <span className="legend-swatch" style={{ '--swatch-color': item.color } as React.CSSProperties} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MapLegend