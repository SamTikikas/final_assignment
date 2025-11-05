const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://new-assignemnt.onrender.com',
    'https://*.vercel.app',
    'https://*.netlify.app',
    process.env.FRONTEND_URL || ''
  ].filter(url => url),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Preflight for all routes
app.options('*', cors(corsOptions));

// City coordinates database
const CITIES = {
  'London': { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
  'New York': { lat: 40.7128, lon: -74.0060, name: 'New York, USA' },
  'Tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  'Dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai, UAE' },
  'Sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
  'Mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai, India' },
  'Paris': { lat: 48.8566, lon: 2.3522, name: 'Paris, France' },
  'Singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  'Toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto, Canada' },
  'Bangkok': { lat: 13.7563, lon: 100.5018, name: 'Bangkok, Thailand' },
  'Moscow': { lat: 55.7558, lon: 37.6173, name: 'Moscow, Russia' },
  'Berlin': { lat: 52.5200, lon: 13.4050, name: 'Berlin, Germany' },
  'Barcelona': { lat: 41.3851, lon: 2.1734, name: 'Barcelona, Spain' },
  'Rome': { lat: 41.9028, lon: 12.4964, name: 'Rome, Italy' },
  'Mexico City': { lat: 19.4326, lon: -99.1332, name: 'Mexico City, Mexico' },
  'Los Angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, USA' },
  'San Francisco': { lat: 37.7749, lon: -122.4194, name: 'San Francisco, USA' },
  'Seoul': { lat: 37.5665, lon: 126.9780, name: 'Seoul, South Korea' },
  'Istanbul': { lat: 41.0082, lon: 28.9784, name: 'Istanbul, Turkey' },
  'Amsterdam': { lat: 52.3676, lon: 4.9041, name: 'Amsterdam, Netherlands' }
};

app.get('/', (req, res) => {
  res.json({ 
    status: 'InfoHub Backend ✅', 
    message: 'API is running',
    api: 'WeatherAPI.com', 
    cities: Object.keys(CITIES),
    endpoints: {
      weather: '/api/weather',
      forecast: '/api/forecast',
      currency: '/api/currency',
      quote: '/api/quote',
      cities: '/api/cities'
    }
  });
});

app.get('/api/cities', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    cities: Object.entries(CITIES).map(([key, val]) => ({
      name: key,
      displayName: val.name,
      lat: val.lat,
      lon: val.lon
    }))
  });
});

// Weather API
app.get('/api/weather', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const city = req.query.city || 'London';
    const weatherApiKey = 'a3dd99f2ce1c4615818225443250411';

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=yes`;
      const response = await axios.get(url, { timeout: 8000 });

      if (response.data) {
        const current = response.data.current;
        const location = response.data.location;

        return res.json({
          city: location.name,
          country: location.country,
          region: location.region || '',
          temperature: Math.round(current.temp_c),
          temperatureF: Math.round(current.temp_f),
          condition: current.condition.text,
          humidity: current.humidity,
          windSpeed: current.wind_kph,
          windSpeedMph: current.wind_mph,
          windDirection: current.wind_dir,
          feelsLike: Math.round(current.feelslike_c),
          icon: current.condition.icon,
          pressure: current.pressure_mb,
          visibility: current.vis_km,
          uvIndex: current.uv,
          dewpoint: Math.round(current.dewpoint_c),
          cached: false,
          source: 'WeatherAPI.com',
          timestamp: new Date().toISOString()
        });
      }
    } catch (apiError) {
      console.log('WeatherAPI error:', apiError.message);
    }

    // Fallback
    return res.json({
      city: city,
      temperature: 22,
      temperatureF: 72,
      condition: 'Clear',
      humidity: 65,
      windSpeed: 10,
      windSpeedMph: 6,
      feelsLike: 21,
      icon: '☀️',
      pressure: 1013,
      visibility: 10,
      uvIndex: 5,
      cached: true,
      source: 'Fallback'
    });

  } catch (error) {
    console.error('Weather Error:', error.message);
    res.status(500).json({ error: 'Weather service error', message: error.message });
  }
});

// Forecast API
app.get('/api/forecast', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const city = req.query.city || 'London';
    const days = req.query.days || 3;
    const weatherApiKey = 'a3dd99f2ce1c4615818225443250411';

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=${days}&aqi=yes`;
      const response = await axios.get(url, { timeout: 8000 });

      if (response.data) {
        const forecast = response.data.forecast.forecastday.map(day => ({
          date: day.date,
          maxTemp: Math.round(day.day.maxtemp_c),
          minTemp: Math.round(day.day.mintemp_c),
          avgTemp: Math.round(day.day.avgtemp_c),
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          chanceOfRain: day.day.daily_chance_of_rain,
          totalRain: day.day.totalprecip_mm,
          avgHumidity: day.day.avghumidity,
          maxWind: day.day.maxwind_kph
        }));

        return res.json({
          city: response.data.location.name,
          forecast: forecast,
          cached: false,
          success: true
        });
      }
    } catch (apiError) {
      console.log('Forecast error:', apiError.message);
    }

    res.json({ error: 'Forecast not available', success: false });

  } catch (error) {
    res.status(500).json({ error: 'Forecast service error' });
  }
});

// Currency API
const manualRates = {
  'USD': 83.25, 'EUR': 91.50, 'GBP': 106.40, 'JPY': 0.55,
  'AUD': 54.80, 'CAD': 61.20, 'CHF': 94.30, 'CNY': 11.55
};

app.get('/api/currency', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const amount = parseFloat(req.query.amount) || 100;
    const targetCurrencies = req.query.to ? req.query.to.split(',') : ['USD', 'EUR', 'GBP'];

    const rates = {};

    try {
      const apiKey = 'cur_live_m8OlHu696xRMnkG78J0A8AWdu7q1DcqRIfI4l0FC';
      const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=INR&currencies=${targetCurrencies.join(',')}`;
      const response = await axios.get(url, { timeout: 5000 });

      if (response.data && response.data.data) {
        Object.keys(response.data.data).forEach(curr => {
          rates[curr] = (amount * response.data.data[curr].value).toFixed(2);
        });
        return res.json({ from: 'INR', amount, rates, fromApi: true, success: true });
      }
    } catch (apiError) {
      console.log('Currency API error');
    }

    targetCurrencies.forEach(curr => {
      const rate = manualRates[curr] || 83;
      rates[curr] = (amount / rate).toFixed(2);
    });

    res.json({ from: 'INR', amount, rates, fromApi: false, cached: true, success: true });

  } catch (error) {
    res.status(500).json({ error: 'Currency service error' });
  }
});

// Quote API
const quotesArray = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only limit to our realization of tomorrow is our doubts.", author: "Franklin D. Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
];

app.get('/api/quote', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    try {
      const apiKey = 'tylCwRteC2isaG7e6u7Kfw==0ZEMjAf5xg6lOO1n';
      const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        headers: { 'X-Api-Key': apiKey },
        timeout: 5000
      });

      if (response.data && response.data.length > 0) {
        return res.json({ 
          text: response.data[0].quote, 
          author: response.data[0].author || 'Unknown', 
          fromApi: true,
          success: true 
        });
      }
    } catch (apiError) {
      console.log('Quote API error');
    }

    const randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
    res.json({ 
      text: randomQuote.text, 
      author: randomQuote.author, 
      fromApi: false, 
      cached: true,
      success: true 
    });

  } catch (error) {
    res.status(500).json({ error: 'Quote service error' });
  }
});

app.get('/api/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ InfoHub Backend running on port ${PORT}`);
  console.log(`🌐 CORS enabled for all domains`);
  console.log(`📍 Base URL: ${process.env.BASE_URL || 'http://localhost:' + PORT}`);
});

module.exports = app;
