import type { FloodZone } from '../../types/flood'

interface PriorityListProps {
  zones: FloodZone[]
  selectedZoneId: string
}

function PriorityList({ zones, selectedZoneId }: PriorityListProps) {
  const priorityZones = [...zones].sort((first, second) => first.priority - second.priority)

  return (
    <section className="panel" aria-labelledby="priority-heading">
      <div className="panel-heading">
        <div>
          <h2 id="priority-heading">Response priorities</h2>
          <p>Ranked mock areas requiring attention</p>
        </div>
      </div>
      <div className="card-body">
        <ol className="priority-list">
          {priorityZones.map((zone, index) => (
            <li className={`priority-item${zone.zoneId === selectedZoneId ? ' priority-item--selected' : ''}`} key={zone.zoneId}>
              <span className="priority-rank">{index + 1}</span>
              <span className="priority-content">
                <strong>{zone.zoneName}</strong>
                <span>{zone.severity} · {zone.riskProbability}% mock risk</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default PriorityList