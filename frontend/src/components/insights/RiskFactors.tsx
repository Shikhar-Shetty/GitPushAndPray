import type { PredictionPoint } from '../../types/flood'

interface RiskFactorsProps {
  prediction: PredictionPoint | null
}

function RiskFactors({ prediction }: RiskFactorsProps) {
  const factors = prediction ? Object.entries(prediction.shap_values)
    .sort((first, second) => Math.abs(second[1]) - Math.abs(first[1]))
    : []
  const largestContribution = Math.max(...factors.map(([, contribution]) => Math.abs(contribution)), 1)

  return (
    <section className="panel" aria-labelledby="factors-heading">
      <div className="panel-heading">
        <div>
          <h2 id="factors-heading">SHAP Values returned by the backend</h2>
        </div>
      </div>
      <div className="card-body">
        {factors.length === 0 ? (
          <p className="briefing-note">Detailed risk factors are not available for this prediction.</p>
        ) : (
          <ul className="factor-list">
            {factors.map(([label, contribution]) => (
              <li className={`factor-item${contribution < 0 ? ' factor-item--negative' : ''}`} key={label}>
                <span className="factor-value">{contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}</span>
                <span className="factor-bar"><span style={{ width: `${Math.abs(contribution) / largestContribution * 100}%` }} /></span>
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
