import type { FloodZone } from '../../types/flood'

interface PriorityListProps {
  zones: FloodZone[]
  selectedZoneId: string
}

function PriorityList({ zones, selectedZoneId }: PriorityListProps) {
  const priorityZones = [...zones].sort((first, second) => first.priority - second.priority)
  const selectedZone = zones.find((zone) => zone.zoneId === selectedZoneId)

  return (
    <section className="panel" aria-labelledby="priority-heading">
      <div className="panel-heading">
        <div>
          <h2 id="priority-heading">Response priorities</h2>
          <p>Ranked mock areas requiring attention</p>
        </div>
      </div>
      <div className="card-body">
        {selectedZone && (
          <div className="priority-focus">
            <span className="meta-label">Selected zone priority</span>
            <strong>{selectedZone.priority === 0 ? 'Immediate response' : `Priority ${selectedZone.priority}`}</strong>
            <span>{selectedZone.affectedInfrastructure.length} associated infrastructure point{selectedZone.affectedInfrastructure.length === 1 ? '' : 's'}</span>
          </div>
        )}
        <ol className="priority-list">
          {priorityZones.map((zone, index) => (
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