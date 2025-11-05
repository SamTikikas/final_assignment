import { useState, useEffect } from 'react'
import './App.css'
import Weather from './components/Weather'
import Forecast from './components/Forecast'
import Currency from './components/Currency'
import Quote from './components/Quote'

const API_URL = import.meta.env.VITE_APP_API_URL

export default function App() {
  const [tab, setTab] = useState('weather')
  const [city, setCity] = useState('London')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Load dark mode preference - ONCE ONLY
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) {
      const isDark = JSON.parse(saved)
      setDarkMode(isDark)
      document.body.classList.toggle('dark-mode', isDark)
    }
  }, []) // Empty dependency - runs ONCE

  // Fetch cities - ONCE ONLY
  useEffect(() => {
    fetch(`${API_URL}/api/cities`)
      .then(r => r.json())
      .then(data => {
        setCities(data.cities || [])
        setLoading(false)
      })
      .catch(e => {
        console.error('Error:', e)
        setLoading(false)
      })
  }, []) // Empty dependency - runs ONCE

  // Update dark mode class - when darkMode changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  if (loading) {
    return (
      <div className="app-container">
        <div className="loader-container">
          <div className="cute-loader">
            <div className="track">
              <div className="train">
                <span className="car">🚂</span>
                <span className="car">🚃</span>
                <span className="car">🚃</span>
              </div>
            </div>
          </div>
          <p className="loading-text">Choo choo... Loading InfoHub</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app">
        <header className="app-header">
          <div className="header-top">
            <div className="logo-section">
              <h1 className="logo">🌍 InfoHub</h1>
              <p className="tagline">Your Weather Companion</p>
            </div>
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <nav className="tabs">
          <button 
            className={`tab ${tab === 'weather' ? 'active' : ''}`}
            onClick={() => setTab('weather')}
          >
            <span className="tab-icon">☀️</span>
            <span className="tab-label">Weather</span>
          </button>
          <button 
            className={`tab ${tab === 'forecast' ? 'active' : ''}`}
            onClick={() => setTab('forecast')}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-label">Forecast</span>
          </button>
          <button 
            className={`tab ${tab === 'currency' ? 'active' : ''}`}
            onClick={() => setTab('currency')}
          >
            <span className="tab-icon">💱</span>
            <span className="tab-label">Currency</span>
          </button>
          <button 
            className={`tab ${tab === 'quote' ? 'active' : ''}`}
            onClick={() => setTab('quote')}
          >
            <span className="tab-icon">✨</span>
            <span className="tab-label">Quote</span>
          </button>
        </nav>

        {(tab === 'weather' || tab === 'forecast') && (
          <div className="city-selector-container">
            <div className="city-selector">
              <label htmlFor="city-select">📍 Select City</label>
              <select 
                id="city-select"
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="city-select"
              >
                {cities.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <main className="content">
          {tab === 'weather' && <Weather city={city} apiUrl={API_URL} />}
          {tab === 'forecast' && <Forecast city={city} apiUrl={API_URL} />}
          {tab === 'currency' && <Currency apiUrl={API_URL} />}
          {tab === 'quote' && <Quote apiUrl={API_URL} />}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>🚀 Built with React & Vite</p>
            <p>Powered by WeatherAPI.com</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
