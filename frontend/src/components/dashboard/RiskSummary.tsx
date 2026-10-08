import type { PredictionPoint } from '../../types/flood'

interface RiskSummaryProps {
  prediction: PredictionPoint | null
  isMock: boolean
}

function getRiskLevel(probability: number): 'low' | 'medium' | 'high' {
  if (probability >= 0.7) return 'high'
  if (probability >= 0.4) return 'medium'
  return 'low'
}

const riskStyles = {
  low: { color: '#2d7468', background: '#e2f1ed' },
  medium: { color: '#946b16', background: '#fff3d8' },
  high: { color: '#a6382d', background: '#fce9e6' },
} as const

function RiskSummary({ prediction, isMock }: RiskSummaryProps) {
  if (!prediction) {
    return (
      <section className="panel" aria-labelledby="risk-summary-heading">
        <div className="panel-heading"><h2 id="risk-summary-heading">Selected prediction</h2></div>
        <div className="card-body"><p className="briefing-note">No nearby prediction point is selected.</p></div>
      </section>
    )
  }

  const riskLevel = getRiskLevel(prediction.flood_probability)
  const riskStyle = riskStyles[riskLevel]

  return (
    <section className="panel" aria-labelledby="risk-summary-heading">
      <div className="panel-heading">
        <div>
          <h2 id="risk-summary-heading">Selected prediction</h2>
          <p>{prediction.latitude.toFixed(4)}, {prediction.longitude.toFixed(4)}</p>
        </div>
        <span className="status-pill" style={{ '--status-color': riskStyle.color, '--status-bg': riskStyle.background } as React.CSSProperties}>
          {riskLevel} risk
        </span>
      </div>
      <div className="card-body">
        <div className="metric-value">{(prediction.flood_probability * 100).toFixed(0)}%</div>
        <div className="metric-label">{isMock ? 'Demo flood probability' : 'Flood probability from backend'}</div>
        <div className="metric-detail">
          <span>Status</span>
          <strong>{prediction.prediction === 1 ? 'Flood predicted' : 'Lower flood risk'}</strong>
        </div>
        <div className="metric-detail">
          <span>Water level estimate</span>
          <strong>{prediction.water_level_estimate_m.toFixed(3)} m</strong>
        </div>
      </div>
    </section>
  )
}

export default RiskSummary
