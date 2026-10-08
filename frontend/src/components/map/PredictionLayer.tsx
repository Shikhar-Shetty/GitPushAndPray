import { CircleMarker } from 'react-leaflet'
import type { PredictionPoint } from '../../types/flood'

interface PredictionLayerProps {
  predictions: PredictionPoint[]
  selectedIndex: number
  onSelectPrediction: (index: number) => void
}

function predictionKey(point: PredictionPoint, index: number): string {
  return `${point.latitude}:${point.longitude}:${index}`
}

function getRiskColor(probability: number): string {
  if (probability >= 0.8) return '#c4443b'
  if (probability >= 0.5) return '#d6a329'
  if (probability >= 0.25) return '#8da94a'
  return '#3c956e'
}

function PredictionLayer({ predictions, selectedIndex, onSelectPrediction }: PredictionLayerProps) {
  return (
    <>
      {predictions.map((point, index) => {
        const isSelected = index === selectedIndex
        const color = getRiskColor(point.flood_probability)

        return (
          <CircleMarker
            center={[point.latitude, point.longitude]}
            eventHandlers={{
              click: (event) => {
                event.originalEvent.stopPropagation()
                onSelectPrediction(index)
              },
            }}
            key={predictionKey(point, index)}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: isSelected ? 0.75 : 0.55,
              weight: isSelected ? 5 : 3,
            }}
            radius={isSelected ? 15 : 11}
          />
        )
      })}
    </>
  )
}

export default PredictionLayer
