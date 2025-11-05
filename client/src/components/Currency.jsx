import { useState, useEffect } from 'react'
import './Currency.css'

export default function Currency({ apiUrl }) {
  const [amount, setAmount] = useState(100)
  const [currency, setCurrency] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch(`${apiUrl}/api/currency?amount=${amount}`)
      .then(r => r.json())
      .then(data => {
        setCurrency(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [amount, apiUrl])

  return (
    <div className="card">
      <h2>💱 Currency Converter</h2>

      <div className="currency-input-section">
        <label htmlFor="amount-input">Amount (INR)</label>
        <div className="input-group">
          <span className="currency-symbol">₹</span>
          <input 
            id="amount-input"
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="amount-input"
            placeholder="Enter amount"
          />
        </div>
      </div>

      {loading && <div className="loader">🔄 Converting...</div>}
      {error && <div className="error">❌ {error}</div>}

      {currency && (
        <div className="currency-grid">
          {Object.entries(currency.rates).map(([code, value]) => (
            <div key={code} className="currency-item" style={{ animationDelay: `${Object.keys(currency.rates).indexOf(code) * 0.1}s` }}>
              <span className="code">{code}</span>
              <span className="amount">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
