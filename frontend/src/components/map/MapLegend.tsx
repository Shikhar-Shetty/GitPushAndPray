import type { RiskLevel } from '../../types/flood'

const legendItems: Array<{ label: string; level: RiskLevel; color: string }> = [
  { label: 'Low', level: 'low', color: '#4b9f91' },
  { label: 'Medium', level: 'medium', color: '#d19a35' },
  { label: 'High', level: 'high', color: '#db6b3f' },
  { label: 'Critical', level: 'critical', color: '#bd493a' },
]

function MapLegend() {
  return (
    <div className="map-legend" aria-label="Flood risk legend">
      <div className="legend-group">
        <strong>Flood risk</strong>
        <ul>
          {legendItems.map((item) => (
            <li key={item.level}>
              <span className="legend-swatch" style={{ '--swatch-color': item.color } as React.CSSProperties} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="legend-group">
        <strong>Infrastructure</strong>
        <ul>
          <li><span className="legend-marker legend-marker--hospital">H</span> Hospital</li>
          <li><span className="legend-marker legend-marker--shelter">S</span> Shelter</li>
          <li><span className="legend-marker legend-marker--rescue">R</span> Rescue facility</li>
          <li><span className="legend-marker legend-marker--public">P</span> Public facility</li>
        </ul>
      </div>
    </div>
  )
}

export default MapLegend