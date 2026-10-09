import type { PredictionPoint } from '../../types/flood'

interface PriorityListProps {
  predictions: PredictionPoint[]
  selectedPredictionIndex: number
  onSelectPrediction: (index: number) => void
}

function getRiskLevel(probability: number): 'high' | 'medium' | 'low' {
  if (probability >= 0.7) return 'high'
  if (probability >= 0.4) return 'medium'
  return 'low'
}

function PriorityList({ predictions, selectedPredictionIndex, onSelectPrediction }: PriorityListProps) {
  const priorityPredictions = predictions
    .map((point, index) => ({ point, index }))
    .sort((first, second) => second.point.flood_probability - first.point.flood_probability)

  return (
    <section className="panel" aria-labelledby="priority-heading">
      <div className="panel-heading">
        <div>
          <h2 id="priority-heading">Response priorities</h2>
          <p>Ranked by backend flood probability</p>
        </div>
      </div>
      <div className="card-body">
        <ol className="priority-list">
          {priorityPredictions.map(({ point, index }, rank) => {
            const riskLevel = getRiskLevel(point.flood_probability)
            return (
              <li className={`priority-item${index === selectedPredictionIndex ? ' priority-item--selected' : ''}`} key={`${point.latitude}:${point.longitude}:${index}`}>
                <span className="priority-rank">{rank + 1}</span>
                <button className="priority-content priority-content--button" type="button" aria-pressed={index === selectedPredictionIndex} onClick={() => onSelectPrediction(index)}>
                  <strong>{`Prediction ${rank + 1}`}</strong>
                  <span className={`priority-level priority-level--${riskLevel}`}>{riskLevel.toUpperCase()} · {(point.flood_probability * 100).toFixed(0)}% flood probability</span>
                  <span>Coordinates: {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</span>
                  <span>Water-level estimate: {point.water_level_estimate_m.toFixed(3)} m</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default PriorityList
