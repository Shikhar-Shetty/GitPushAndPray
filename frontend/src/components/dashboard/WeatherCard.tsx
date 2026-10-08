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
          <p>{weather.location} · mock Open-Meteo data</p>
        </div>
      </div>
      <div className="card-body">
        <div className="metric-value">{weather.temperatureCelsius}°C</div>
        <div className="metric-label">{weather.condition} · observed {weather.observedAt}</div>
        <div className="metric-detail">
          <span>Rainfall <strong>{weather.rainfallMillimeters} mm</strong></span>
          <span>Wind <strong>{weather.windKilometersPerHour} km/h</strong></span>
        </div>
        <p className="briefing-note">Demo weather only. Live Open-Meteo data will be integrated later.</p>
      </div>
    </section>
  )
}

export default WeatherCard