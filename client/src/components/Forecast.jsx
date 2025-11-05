import { useState, useEffect } from 'react'
import './Forecast.css'

export default function Forecast({ city, apiUrl }) {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch(`${apiUrl}/api/forecast?city=${city}&days=3`)
      .then(r => r.json())
      .then(data => {
        setForecast(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [city, apiUrl])

  if (loading) return <div className="loader">📊 Loading forecast...</div>
  if (error) return <div className="error">❌ {error}</div>
  if (!forecast?.forecast) return <div className="error">No forecast</div>

  return (
    <div className="card">
      <h2>📅 3-Day Forecast - {forecast.city}</h2>

      <div className="forecast-grid">
        {forecast.forecast.map((day, i) => (
          <div key={i} className="forecast-item" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="date">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <img src={day.icon} alt={day.condition} className="forecast-icon" onError={(e) => e.target.src = '☀️'} />
            <p className="forecast-condition">{day.condition}</p>
            <div className="temps">
              <span className="max">↑ {day.maxTemp}°</span>
              <span className="min">↓ {day.minTemp}°</span>
            </div>
            <div className="forecast-details">
              <span>🌧️ {day.chanceOfRain}%</span>
              <span>💨 {day.maxWind} kph</span>
              <span>💧 {day.totalRain}mm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
