const legendItems = [
  { label: 'Under 25%', color: '#3c956e' },
  { label: '25–49%', color: '#8da94a' },
  { label: '50–79%', color: '#d6a329' },
  { label: '80% or higher', color: '#c4443b' },
]

function MapLegend() {
  return (
    <div className="map-legend" aria-label="Flood risk legend">
      <div className="legend-group">
        <strong>Flood risk</strong>
        <ul>
          {legendItems.map((item) => (
            <li key={item.label}>
              <span className="legend-swatch" style={{ '--swatch-color': item.color } as React.CSSProperties} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MapLegend