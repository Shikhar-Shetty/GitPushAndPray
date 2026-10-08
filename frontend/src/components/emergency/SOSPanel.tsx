import type { FloodZone, InfrastructurePoint } from '../../types/flood'

interface SOSPanelProps {
  zone: FloodZone
}

const infrastructureLabels: Record<InfrastructurePoint['type'], string> = {
  hospital: 'Hospital',
  shelter: 'Shelter',
  rescue: 'Rescue facility',
  public: 'Public facility',
}

function SOSPanel({ zone }: SOSPanelProps) {
  const nearestRescue = zone.affectedInfrastructure.find((point) => point.type === 'rescue')
  const nearestShelter = zone.affectedInfrastructure.find((point) => point.type === 'shelter')

  return (
    <section className={`panel sos-panel sos-panel--${zone.emergencyStatus}`} aria-labelledby="sos-heading">
      <div className="panel-heading">
        <div>
          <h2 id="sos-heading">Emergency response</h2>
          <p>Frontend demonstration workflow</p>
        </div>
        <span className="status-pill">{zone.emergencyStatus}</span>
      </div>
      <div className="card-body">
        <div className="response-zone">
          <span className="meta-label">Selected zone</span>
          <strong>{zone.zoneName}</strong>
          <span>{zone.riskLevel.toUpperCase()} risk · Priority {zone.priority === 0 ? 'immediate' : zone.priority}</span>
        </div>
        <div className="response-action">
          <span className="meta-label">Recommended immediate action</span>
          <strong>{zone.recommendedAction}</strong>
        </div>
        <div className="response-facilities">
          <div>
            <span className="meta-label">Nearest rescue facility</span>
            <strong>{nearestRescue?.name ?? 'No mock rescue facility listed'}</strong>
            <span>{nearestRescue ? `${nearestRescue.distanceKilometers.toFixed(1)} km · ${nearestRescue.status}` : 'Demo data unavailable'}</span>
          </div>
          <div>
            <span className="meta-label">Nearby shelter</span>
            <strong>{nearestShelter?.name ?? 'No mock shelter listed'}</strong>
            <span>{nearestShelter ? `${nearestShelter.distanceKilometers.toFixed(1)} km · ${nearestShelter.status}` : 'Demo data unavailable'}</span>
          </div>
        </div>
        <div className="metric-label">Affected infrastructure</div>
        <ul className="infrastructure-list">
          {zone.affectedInfrastructure.map((point) => (
            <li key={point.id}><strong>{infrastructureLabels[point.type]}</strong> · {point.name} · {point.status}</li>
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