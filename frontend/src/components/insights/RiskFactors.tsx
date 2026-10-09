import type { PredictionPoint } from '../../types/flood'

interface RiskFactorsProps {
  prediction: PredictionPoint | null
}

function RiskFactors({ prediction }: RiskFactorsProps) {
  const factors = prediction ? Object.entries(prediction.shap_values)
    .filter(([, contribution]) => contribution > 0)
    .sort((first, second) => second[1] - first[1])
    : []
  const largestContribution = Math.max(...factors.map(([, contribution]) => contribution), 1)

  return (
    <section className="panel" aria-labelledby="factors-heading">
      <div className="panel-heading">
        <div>
          <h2 id="factors-heading">Feature contributing to the prediction</h2>
        </div>
      </div>
      <div className="card-body">
        {factors.length === 0 ? (
          <p className="briefing-note">No positive feature contributions are available for this prediction.</p>
        ) : (
          <ul className="factor-list">
            {factors.map(([label, contribution]) => (
              <li className="factor-item" key={label}>
                <span className="factor-value">+{contribution.toFixed(2)}</span>
                <span className="factor-bar"><span style={{ width: `${contribution / largestContribution * 100}%` }} /></span>
                <span className="metric-label">{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default RiskFactors
