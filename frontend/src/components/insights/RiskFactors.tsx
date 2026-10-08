import type { RiskFactor } from '../../types/flood'

interface RiskFactorsProps {
  factors: RiskFactor[]
}

function RiskFactors({ factors }: RiskFactorsProps) {
  return (
    <section className="panel" aria-labelledby="factors-heading">
      <div className="panel-heading">
        <div>
          <h2 id="factors-heading">Why this area is at risk</h2>
          <p>Mock SHAP-style contributions for demonstration.</p>
        </div>
      </div>
      <div className="card-body">
        <ul className="factor-list">
          {factors.map((factor) => (
            <li className="factor-item" key={factor.label}>
              <span className="factor-value">+{factor.contribution.toFixed(2)}</span>
              <span className="factor-bar"><span style={{ width: `${factor.contribution * 100}%` }} /></span>
              <span className="metric-label">{factor.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RiskFactors