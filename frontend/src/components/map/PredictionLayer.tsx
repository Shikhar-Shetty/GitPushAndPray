import { CircleMarker, Popup } from 'react-leaflet'
import type { PredictionPoint } from '../../types/flood'

interface PredictionLayerProps {
  predictions: PredictionPoint[]
  selectedIndex: number
  onSelectPrediction: (index: number) => void
}

function predictionKey(point: PredictionPoint, index: number): string {
  return `${point.latitude}:${point.longitude}:${index}`
}

function getRiskLabel(probability: number): string {
  if (probability >= 0.7) return 'High'
  if (probability >= 0.4) return 'Medium'
  return 'Low'
}

function getRiskColor(probability: number): string {
  const hue = Math.max(0, Math.min(120, (1 - probability) * 120))
  return `hsl(${hue} 72% 42%)`
}

function PredictionLayer({ predictions, selectedIndex, onSelectPrediction }: PredictionLayerProps) {
  return (
    <>
      {predictions.map((point, index) => {
        const isSelected = index === selectedIndex
        const riskLabel = getRiskLabel(point.flood_probability)
        const color = getRiskColor(point.flood_probability)

        return (
          <CircleMarker
            center={[point.latitude, point.longitude]}
            eventHandlers={{ click: () => onSelectPrediction(index) }}
            key={predictionKey(point, index)}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: isSelected ? 0.75 : 0.55,
              weight: isSelected ? 5 : 3,
            }}
            radius={isSelected ? 15 : 11}
          >
            <Popup>
              <strong>{riskLabel} flood risk</strong>
              <br />
              Flood probability: {(point.flood_probability * 100).toFixed(0)}%
              <br />
              Status: {point.prediction === 1 ? 'Flood predicted' : 'Lower flood risk'}
              <br />
              Water level estimate: {point.water_level_estimate_m.toFixed(3)} m
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}

export default PredictionLayer
