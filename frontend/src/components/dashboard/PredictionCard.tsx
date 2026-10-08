import type { FloodZone } from '../../types/flood'

interface PredictionCardProps {
  zone: FloodZone
}

function PredictionCard({ zone }: PredictionCardProps) {
  return (
    <section className="panel" aria-labelledby="prediction-heading">
      <div className="panel-heading">
        <div>
          <h2 id="prediction-heading">Forecast window</h2>
          <p>{zone.zoneName} · mock forecast</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#0b7775', '--status-bg': '#dcefee' } as React.CSSProperties}>Demo data</span>
      </div>
      <div className="card-body">
        <div className="metric-value">{zone.riskProbability}%</div>
        <div className="metric-label">Mock flood probability</div>
        <div className="metric-detail">
          <span>Severity <strong>{zone.severity}</strong></span>
          <span>Onset <strong>{zone.expectedOnset}</strong></span>
        </div>
        <div className="metric-detail">
          <span>Expected peak</span>
          <strong>{zone.expectedPeak}</strong>
        </div>
      </div>
    </section>
  )
}

export default PredictionCard