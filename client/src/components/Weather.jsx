import { useState, useEffect } from 'react'
import './Weather.css'

export default function Weather({ city, apiUrl }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch(`${apiUrl}/api/weather?city=${city}`)
      .then(r => r.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [city, apiUrl])

  if (loading) return (
    <div className="card">
      <div className="loader">
        <div className="spinner"></div>
        Fetching weather...
      </div>
    </div>
  )
  if (error) return <div className="error">❌ {error}</div>
  if (!weather) return <div className="error">No data</div>

  return (
    <div className="card weather-card">
      <div className="weather-header">
        <div>
          <h2>{weather.city}</h2>
          <p className="country">{weather.country}</p>
        </div>
        <div className="weather-status">
          {weather.cached && <span className="badge cached">📦 Cached</span>}
          {!weather.cached && <span className="badge live">🔴 Live</span>}
        </div>
      </div>

      <div className="weather-main">
        <div className="temp-display">
          <img src={weather.icon} alt={weather.condition} className="weather-icon" onError={(e) => e.target.src = '☀️'} />
          <div className="temp-info">
            <span className="temp">{weather.temperature}°C</span>
            <span className="tempf">({weather.temperatureF}°F)</span>
          </div>
        </div>
        <div className="condition-box">
          <p className="condition">{weather.condition}</p>
          <p className="feels">Feels like {weather.feelsLike}°C</p>
        </div>
      </div>

      <div className="weather-grid">
        <div className="weather-item">
          <span className="icon">💧</span>
          <span className="label">Humidity</span>
          <span className="value">{weather.humidity}%</span>
        </div>
        <div className="weather-item">
          <span className="icon">💨</span>
          <span className="label">Wind Speed</span>
          <span className="value">{weather.windSpeed} kph</span>
        </div>
        <div className="weather-item">
          <span className="icon">🧭</span>
          <span className="label">Direction</span>
          <span className="value">{weather.windDirection}</span>
        </div>
        <div className="weather-item">
          <span className="icon">🌡️</span>
          <span className="label">Pressure</span>
          <span className="value">{weather.pressure} mb</span>
        </div>
        <div className="weather-item">
          <span className="icon">☀️</span>
          <span className="label">UV Index</span>
          <span className="value">{weather.uvIndex}</span>
        </div>
        <div className="weather-item">
          <span className="icon">👁️</span>
          <span className="label">Visibility</span>
          <span className="value">{weather.visibility} km</span>
        </div>
      </div>
    </div>
  )
}
