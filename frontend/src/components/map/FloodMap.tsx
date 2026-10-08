import type { FloodZone, InfrastructurePoint } from '../../types/flood'
import InfrastructureLayer from './InfrastructureLayer'
import MapLegend from './MapLegend'
import RiskZones from './RiskZones'

interface FloodMapProps {
  zones: FloodZone[]
  infrastructure: InfrastructurePoint[]
}

function FloodMap({ zones, infrastructure }: FloodMapProps) {
  return (
    <section className="panel dashboard-map" aria-labelledby="map-heading">
      <div className="panel-heading">
        <div>
          <h2 id="map-heading">Flood risk map</h2>
          <p>Interactive Leaflet layer will be connected to the API contract.</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#0b7775', '--status-bg': '#dcefee' } as React.CSSProperties}>
          Mock view
        </span>
      </div>
      <div className="map-frame">
        <RiskZones zones={zones} />
        <InfrastructureLayer points={infrastructure} />
        <MapLegend />
      </div>
    </section>
  )
}

export default FloodMap