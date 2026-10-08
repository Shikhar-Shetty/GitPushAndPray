import { useState } from 'react'
import AIBriefing from '../components/insights/AIBriefing'
import EmergencyContacts from '../components/emergency/EmergencyContacts'
import RiskFactors from '../components/insights/RiskFactors'
import SOSPanel from '../components/emergency/SOSPanel'
import DashboardLayout from '../components/layout/DashboardLayout'
import Header from '../components/layout/Header'
import FloodMap from '../components/map/FloodMap'
import PredictionCard from '../components/dashboard/PredictionCard'
import PriorityList from '../components/dashboard/PriorityList'
import RiskSummary from '../components/dashboard/RiskSummary'
import WeatherCard from '../components/dashboard/WeatherCard'
import { mockDashboardData } from '../data/mockData'

function Dashboard() {
  const data = mockDashboardData
  const [selectedZone, setSelectedZone] = useState(data.zones[0])
  const infrastructure = [
    ...new Map(
      data.zones
        .flatMap((zone) => zone.affectedInfrastructure)
        .map((point) => [point.id, point]),
    ).values(),
  ]

  return (
    <DashboardLayout header={<Header lastUpdated={data.lastUpdated} />}>
      <div className="dashboard-grid">
        <FloodMap
          zones={data.zones}
          infrastructure={infrastructure}
          selectedInfrastructureIds={selectedZone.affectedInfrastructure.map((point) => point.id)}
          selectedZoneId={selectedZone.zoneId}
          onSelectZone={setSelectedZone}
        />
        <div className="dashboard-stack">
          <RiskSummary zone={selectedZone} />
          <WeatherCard weather={selectedZone.weather} />
          <PredictionCard zone={selectedZone} />
        </div>
      </div>
      <div className="dashboard-section dashboard-section--split">
        <RiskFactors factors={selectedZone.riskFactors} />
        <PriorityList zones={data.zones} selectedZoneId={selectedZone.zoneId} />
      </div>
      <div className="dashboard-section dashboard-section--split">
        <AIBriefing briefing={selectedZone.aiBriefing} />
        <div className="emergency-stack">
          <SOSPanel zone={selectedZone} />
          <EmergencyContacts contacts={data.emergencyContacts} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard