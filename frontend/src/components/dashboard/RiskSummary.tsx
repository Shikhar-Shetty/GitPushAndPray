import type { FloodZone } from '../../types/flood'

interface RiskSummaryProps {
  zone: FloodZone
}

const riskStyles = {
  low: { color: '#2d7468', background: '#e2f1ed', label: 'Low' },
  medium: { color: '#946b16', background: '#fff3d8', label: 'Medium' },
  high: { color: '#a74b27', background: '#fff0e9', label: 'High' },
  critical: { color: '#a6382d', background: '#fce9e6', label: 'Critical' },
} as const

function RiskSummary({ zone }: RiskSummaryProps) {
  const riskStyle = riskStyles[zone.riskLevel]

  return (
    <section className="panel" aria-labelledby="risk-summary-heading">
      <div className="panel-heading">
        <div>
          <h2 id="risk-summary-heading">Selected area</h2>
          <p>{zone.zoneName}</p>
        </div>
        <span className="status-pill" style={{ '--status-color': riskStyle.color, '--status-bg': riskStyle.background } as React.CSSProperties}>
          {riskStyle.label} risk
        </span>
      </div>
      <div className="card-body">
        <div className="metric-value">{zone.riskProbability}%</div>
        <div className="metric-label">Mock flood probability</div>
        <div className="metric-detail">
          <span>Severity</span>
          <strong>{zone.severity}</strong>
        </div>
        <div className="metric-detail">
          <span>Onset</span>
          <strong>{zone.expectedOnset}</strong>
        </div>
        <div className="metric-detail">
          <span>Peak</span>
          <strong>{zone.expectedPeak}</strong>
        </div>
      </div>
    </section>
  )
}

export default RiskSummary