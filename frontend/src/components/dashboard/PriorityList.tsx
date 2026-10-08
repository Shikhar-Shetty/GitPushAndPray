import type { PriorityItem } from '../../types/flood'

interface PriorityListProps {
  items: PriorityItem[]
}

function PriorityList({ items }: PriorityListProps) {
  return (
    <section className="panel" aria-labelledby="priority-heading">
      <div className="panel-heading">
        <div>
          <h2 id="priority-heading">Response priorities</h2>
          <p>Areas needing attention first</p>
        </div>
      </div>
      <div className="card-body">
        <ol className="priority-list">
          {items.map((item, index) => (
            <li className="priority-item" key={item.id}>
              <span className="priority-rank">{index + 1}</span>
              <span className="priority-content">
                <strong>{item.name}</strong>
                <span>{item.detail} · {item.riskLevel} risk</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default PriorityList