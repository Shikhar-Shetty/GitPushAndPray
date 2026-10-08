import type { InfrastructurePoint } from '../../types/flood'

interface SOSPanelProps {
  infrastructure: InfrastructurePoint[]
}

function SOSPanel({ infrastructure }: SOSPanelProps) {
  return (
    <section className="panel sos-panel" aria-labelledby="sos-heading">
      <div className="panel-heading">
        <div>
          <h2 id="sos-heading">Emergency response</h2>
          <p>Mock support panel for the selected zone</p>
        </div>
      </div>
      <div className="card-body">
        <div className="metric-label">Affected infrastructure</div>
        <ul className="infrastructure-list">
          {infrastructure.map((point) => (
            <li key={point.id}>{point.name}</li>
          ))}
        </ul>
        <button className="sos-button" type="button" disabled title="Available after emergency services are integrated">
          SOS · Request nearest responder
        </button>
        <p className="briefing-note">Demo button only. No call, location, or responder request will be made.</p>
      </div>
    </section>
  )
}

export default SOSPanel