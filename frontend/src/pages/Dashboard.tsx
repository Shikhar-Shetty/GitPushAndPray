import { useState } from 'react'
import AIBriefing from '../components/insights/AIBriefing'
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
  const [selectedZone, setSelectedZone] = useState(data.selectedZone)

  return (
    <DashboardLayout header={<Header lastUpdated={data.lastUpdated} />}>
      <div className="dashboard-grid">
        <FloodMap
          zones={data.zones}
          infrastructure={data.infrastructure}
          selectedZoneId={selectedZone.id}
          onSelectZone={setSelectedZone}
        />
        <div className="dashboard-stack">
          <RiskSummary zone={selectedZone} />
          <WeatherCard weather={data.weather} />
          <PredictionCard
            prediction={{
              ...data.prediction,
              severity: selectedZone.severity,
              onset: selectedZone.onset,
              peak: selectedZone.peak,
            }}
          />
        </div>
      </div>
      <div className="dashboard-section dashboard-section--split">
        <RiskFactors factors={data.riskFactors} />
        <PriorityList items={data.priorityItems} />
      </div>
      <div className="dashboard-section dashboard-section--split">
        <AIBriefing briefing={data.briefing} />
        <SOSPanel />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard