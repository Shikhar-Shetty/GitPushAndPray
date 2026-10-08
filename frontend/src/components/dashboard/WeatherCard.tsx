import type { WeatherSnapshot } from '../../types/flood'

interface WeatherCardProps {
  weather: WeatherSnapshot
}

function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section className="panel weather-card" aria-labelledby="weather-heading">
      <div className="panel-heading">
        <div>
          <h2 id="weather-heading">Current weather</h2>
          <p>{weather.location} · mock Open-Meteo data</p>
        </div>
        <span className={`status-pill weather-status weather-status--${weather.weatherStatus}`}>
          {weather.weatherStatus}
        </span>
      </div>
      <div className="card-body">
        <div className="weather-hero">
          <div>
            <div className="metric-value">{weather.temperatureCelsius}°C</div>
            <div className="metric-label">{weather.condition}</div>
          </div>
          <div className="weather-updated">Updated {weather.observedAt}</div>
        </div>
        <div className="weather-metrics">
          <div className="weather-metric weather-metric--rainfall">
            <span className="meta-label">Rainfall</span>
            <strong>{weather.rainfallMillimeters} mm</strong>
            <span>accumulated demo total</span>
          </div>
          <div className="weather-metric">
            <span className="meta-label">Precipitation</span>
            <strong>{weather.precipitationMillimeters} mm</strong>
            <span>current demo rate</span>
          </div>
          <div className="weather-metric">
            <span className="meta-label">Wind speed</span>
            <strong>{weather.windKilometersPerHour} km/h</strong>
            <span>near selected zone</span>
          </div>
        </div>
        <p className="briefing-note">Demo weather only. Live Open-Meteo data will be integrated later.</p>
      </div>
    </section>
  )
}

export default WeatherCard