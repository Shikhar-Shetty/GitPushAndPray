import type { FloodZone } from '../../types/flood'

interface RiskSummaryProps {
  zone: FloodZone
}

function RiskSummary({ zone }: RiskSummaryProps) {
  return (
    <section className="panel" aria-labelledby="risk-summary-heading">
      <div className="panel-heading">
        <div>
          <h2 id="risk-summary-heading">Selected area</h2>
          <p>{zone.name}</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#db6b3f', '--status-bg': '#fff0e9' } as React.CSSProperties}>
          {zone.riskLevel} risk
        </span>
      </div>
      <div className="card-body">
        <div className="metric-value">{zone.probability}%</div>
        <div className="metric-label">Estimated flood probability</div>
        <div className="metric-detail">
          <span>Coordinates</span>
          <strong>{zone.coordinates.latitude.toFixed(3)}, {zone.coordinates.longitude.toFixed(3)}</strong>
        </div>
      </div>
    </section>
  )
}

export default RiskSummary