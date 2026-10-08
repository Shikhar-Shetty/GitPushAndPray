import type { PredictionPoint } from '../../types/flood'

interface PredictionCardProps {
  prediction: PredictionPoint | null
  isMock: boolean
}

function PredictionCard({ prediction, isMock }: PredictionCardProps) {
  if (!prediction) {
    return (
      <section className="panel" aria-labelledby="prediction-heading">
        <div className="panel-heading"><h2 id="prediction-heading">Forecast window</h2></div>
        <div className="card-body"><p className="briefing-note">No nearby prediction areas were returned.</p></div>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="prediction-heading">
      <div className="panel-heading">
        <div>
          <h2 id="prediction-heading">Forecast window</h2>
          <p>{prediction.latitude.toFixed(4)}, {prediction.longitude.toFixed(4)}</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#0b7775', '--status-bg': '#dcefee' } as React.CSSProperties}>
          {isMock ? 'Demo data' : 'Backend data'}
        </span>
      </div>
      <div className="card-body">
        <div className="metric-value">{(prediction.flood_probability * 100).toFixed(0)}%</div>
        <div className="metric-label">Flood probability</div>
        <div className="metric-detail">
          <span>Prediction</span>
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

export default PredictionCard
