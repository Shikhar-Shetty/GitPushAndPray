import type { FloodZone, PredictionPoint } from '../../types/flood'

interface PriorityListProps {
  zones: FloodZone[]
  selectedZoneId: string
  prediction: PredictionPoint | null
  predictions: PredictionPoint[]
  isRealData: boolean
  selectedPredictionIndex: number
  onSelectPrediction: (index: number) => void
}

function getRiskLevel(probability: number): 'high' | 'medium' | 'low' {
  if (probability >= 0.7) return 'high'
  if (probability >= 0.4) return 'medium'
  return 'low'
}

function PriorityList({ zones, selectedZoneId, prediction, predictions, isRealData, selectedPredictionIndex, onSelectPrediction }: PriorityListProps) {
  const priorityZones = [...zones].sort((first, second) => first.priority - second.priority)
  const selectedZone = zones.find((zone) => zone.zoneId === selectedZoneId)
  const priorityPredictions = predictions
    .map((point, index) => ({ point, index }))
    .sort((first, second) => second.point.flood_probability - first.point.flood_probability)

  return (
    <section className="panel" aria-labelledby="priority-heading">
      <div className="panel-heading">
        <div>
          <h2 id="priority-heading">Response priorities</h2>
          <p>{isRealData ? 'Ranked by backend flood probability' : 'Ranked mock areas requiring attention'}</p>
        </div>
      </div>
      <div className="card-body">
        {!isRealData && selectedZone && (
          <div className="priority-focus">
            <span className="meta-label">Selected prediction priority</span>
            <strong>{prediction && prediction.flood_probability >= 0.7 ? 'High response priority' : prediction && prediction.flood_probability >= 0.4 ? 'Monitor closely' : 'Lower response priority'}</strong>
            <span>{prediction ? `${(prediction.flood_probability * 100).toFixed(0)}% flood probability · ` : ''}{selectedZone.affectedInfrastructure.length} associated infrastructure point{selectedZone.affectedInfrastructure.length === 1 ? '' : 's'}</span>
          </div>
        )}
        <ol className="priority-list">
          {isRealData ? priorityPredictions.map(({ point, index }, rank) => {
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
          }) : priorityZones.map((zone, index) => (
            <li className={`priority-item${zone.zoneId === selectedZoneId ? ' priority-item--selected' : ''}`} key={zone.zoneId}>
              <span className="priority-rank">{index + 1}</span>
              <span className="priority-content">
                <strong>{zone.zoneName}</strong>
                <span className={`priority-level priority-level--${zone.riskLevel}`}>{zone.riskLevel.toUpperCase()} · {zone.riskProbability}% mock risk</span>
                <span>{zone.severity}</span>
                <span>Affected: {zone.affectedInfrastructure.map((point) => point.name).join(', ')}</span>
                <span>Reason: {zone.riskFactors[0]?.label ?? 'Combined mock risk factors'}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default PriorityList
