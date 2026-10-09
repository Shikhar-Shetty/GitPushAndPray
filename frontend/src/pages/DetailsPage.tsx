import type { PredictionPoint } from '../types/flood'
import Header from '../components/layout/Header'
import AffectedFacilities from '../components/dashboard/AffectedFacilities'
import PredictionCard from '../components/dashboard/PredictionCard'
import PriorityList from '../components/dashboard/PriorityList'
import RiskFactors from '../components/insights/RiskFactors'
import AIBriefing from '../components/insights/AIBriefing'

interface DetailsPageProps {
  predictions: PredictionPoint[]
  selectedPredictionIndex: number
  lastUpdated: string | null
  onSelectPrediction: (index: number) => void
  onBack: () => void
}

function getRiskColor(probability: number): string {
  if (probability >= 0.8) return '#c4443b'
  if (probability >= 0.5) return '#d6a329'
  if (probability >= 0.25) return '#8da94a'
  return '#3c956e'
}

function getRiskLabel(probability: number): string {
  if (probability >= 0.8) return 'Critical'
  if (probability >= 0.5) return 'High'
  if (probability >= 0.25) return 'Moderate'
  return 'Low'
}

function DetailsPage({
  predictions,
  selectedPredictionIndex,
  lastUpdated,
  onSelectPrediction,
  onBack,
}: DetailsPageProps) {
  const selectedPrediction = predictions[selectedPredictionIndex] ?? null

  return (
    <div className="details-page">
      <Header lastUpdated={lastUpdated ?? 'N/A'} onBack={onBack} />

      <div className="details-tabs">
        {predictions.map((point, index) => {
          const isActive = index === selectedPredictionIndex
          const color = getRiskColor(point.flood_probability)
          return (
            <button
              className={`details-tab${isActive ? ' details-tab--active' : ''}`}
              key={`${point.latitude}:${point.longitude}:${index}`}
              type="button"
              onClick={() => onSelectPrediction(index)}
              style={{ '--tab-color': color } as React.CSSProperties}
            >
              <span className="details-tab-rank">{index + 1}</span>
              <span className="details-tab-info">
                <strong>{getRiskLabel(point.flood_probability)} · {(point.flood_probability * 100).toFixed(0)}%</strong>
                <span>{point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</span>
              </span>
            </button>
          )
        })}
      </div>

      <main className="details-content">
        <PredictionCard prediction={selectedPrediction} isMock={false} />
        <div className="details-grid">
          <RiskFactors prediction={selectedPrediction} />
          <AIBriefing briefing={selectedPrediction?.explanation ?? ''} isMock={false} />
        </div>
        <div className="details-grid">
          <PriorityList
            predictions={predictions}
            selectedPredictionIndex={selectedPredictionIndex}
            onSelectPrediction={onSelectPrediction}
          />
          {selectedPrediction?.affected_facilities && (
            <AffectedFacilities
              key={`${selectedPrediction.latitude}:${selectedPrediction.longitude}`}
              facilities={selectedPrediction.affected_facilities}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default DetailsPage
