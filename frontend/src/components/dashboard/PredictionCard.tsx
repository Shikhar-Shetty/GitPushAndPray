import type { PredictionSummary } from '../../types/flood'

interface PredictionCardProps {
  prediction: PredictionSummary
}

function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <section className="panel" aria-labelledby="prediction-heading">
      <div className="panel-heading">
        <div>
          <h2 id="prediction-heading">Forecast window</h2>
          <p>Model output placeholder</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#0b7775', '--status-bg': '#dcefee' } as React.CSSProperties}>
          {prediction.confidence}% confidence
        </span>
      </div>
      <div className="card-body">
        <div className="metric-value">{prediction.severity}</div>
        <div className="metric-detail">
          <span>Onset <strong>{prediction.onset}</strong></span>
          <span>Peak <strong>{prediction.peak}</strong></span>
        </div>
      </div>
    </section>
  )
}

export default PredictionCard