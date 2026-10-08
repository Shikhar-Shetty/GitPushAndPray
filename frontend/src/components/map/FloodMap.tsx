import type { FloodZone, InfrastructurePoint } from '../../types/flood'
import { MapContainer, TileLayer } from 'react-leaflet'
import InfrastructureLayer from './InfrastructureLayer'
import MapLegend from './MapLegend'
import RiskZones from './RiskZones'
import 'leaflet/dist/leaflet.css'

interface FloodMapProps {
  zones: FloodZone[]
  infrastructure: InfrastructurePoint[]
  selectedZoneId: string
  onSelectZone: (zone: FloodZone) => void
}

function FloodMap({ zones, infrastructure, selectedZoneId, onSelectZone }: FloodMapProps) {
  return (
    <section className="panel dashboard-map" aria-labelledby="map-heading">
      <div className="panel-heading">
        <div>
          <h2 id="map-heading">Flood risk map</h2>
          <p>Mock zones for frontend demonstration only.</p>
        </div>
        <span className="status-pill" style={{ '--status-color': '#0b7775', '--status-bg': '#dcefee' } as React.CSSProperties}>
          Mock view
        </span>
      </div>
      <div className="map-frame">
        <MapContainer
          center={[12.9141, 74.8560]}
          className="leaflet-map"
          scrollWheelZoom
          zoom={12}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RiskZones
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={onSelectZone}
          />
          <InfrastructureLayer points={infrastructure} />
        </MapContainer>
        <MapLegend />
      </div>
    </section>
  )
}

export default FloodMap