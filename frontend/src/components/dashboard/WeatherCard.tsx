import type { WeatherSnapshot } from '../../types/flood'

interface WeatherCardProps {
  weather: WeatherSnapshot
}

function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section className="panel" aria-labelledby="weather-heading">
      <div className="panel-heading">
        <div>
          <h2 id="weather-heading">Current weather</h2>
          <p>{weather.location} · {weather.observedAt}</p>
        </div>
      </div>
      <div className="card-body">
        <div className="metric-value">{weather.temperatureCelsius}°C</div>
        <div className="metric-label">{weather.condition}</div>
        <div className="metric-detail">
          <span>Rainfall <strong>{weather.rainfallMillimeters} mm</strong></span>
          <span>Wind <strong>{weather.windKilometersPerHour} km/h</strong></span>
        </div>
      </div>
    </section>
  )
}

export default WeatherCard