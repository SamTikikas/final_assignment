import { useState, useEffect } from 'react'
import './Quote.css'

export default function Quote({ apiUrl }) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchQuote = () => {
    setLoading(true)
    setError('')
    setCopied(false)

    fetch(`${apiUrl}/api/quote`)
      .then(r => r.json())
      .then(data => {
        setQuote(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchQuote()
  }, [apiUrl])

  const handleCopy = async () => {
    if (quote) {
      await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (error) return <div className="error">❌ {error}</div>

  return (
    <div className="card quote-card">
      <h2>✨ Daily Inspiration</h2>

      {loading ? (
        <div className="cute-quote-loader">
          <div className="thinking">💭</div>
          <p>Thinking of a great quote...</p>
        </div>
      ) : quote ? (
        <>
          <div className="quote-box">
            <p className="quote-text">{quote.text}</p>
            <p className="quote-author">— {quote.author}</p>
          </div>

          <div className="quote-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={fetchQuote} 
              disabled={loading}
              title="Get another quote"
            >
              {loading ? '⏳ Loading...' : '🔄 Next Quote'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
