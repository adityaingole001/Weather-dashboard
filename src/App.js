import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import SearchEngine from "./components/SearchEngine";
import Forecast from "./components/Forecast";
import Credit from "./components/Credit";
import "./styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [forecast, setForecast] = useState([]);
  const requestId = useRef(0);

  const apiKey = "b03a640e5ef6980o4da35b006t5f2942";

  const backgroundClass = useMemo(() => {
    if (!weather.data.condition) return "App";
    const description = weather.data.condition.description.toLowerCase();
    if (description.includes("clear")) return "clear-weather";
    if (description.includes("cloud")) return "cloudy-weather";
    if (description.includes("rain")) return "rainy-weather";
    if (description.includes("snow")) return "snowy-weather";
    return "App";
  }, [weather.data.condition]);

  const fetchData = useCallback(async (location) => {
    const city = location.trim();
    if (!city) return;

    const activeRequest = ++requestId.current;
    setWeather({ data: {}, loading: true, error: false });
    setForecast([]);

    const encodedCity = encodeURIComponent(city);
    const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${encodedCity}&key=${apiKey}`;
    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodedCity}&key=${apiKey}&units=metric`;

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl),
      ]);
      if (activeRequest !== requestId.current) return;

      setWeather({ data: currentRes.data, loading: false, error: false });
      setForecast(Array.isArray(forecastRes.data.daily) ? forecastRes.data.daily : []);
    } catch (error) {
      if (activeRequest !== requestId.current) return;
      setWeather({ data: {}, loading: false, error: true });
      setForecast([]);
      console.error("Error fetching weather data:", error);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchData("Mumbai");
  }, [fetchData]);

  const search = (event) => {
    event.preventDefault();
    fetchData(query);
  };

  return (
    <div className={`App ${backgroundClass}`} data-theme={isDarkMode ? "dark" : "light"}>
      <header className="app-header">
        <a className="brand" href="/" aria-label="Weather dashboard home">
          <span className="brand-icon" aria-hidden="true">
            <i className="fas fa-cloud-sun" />
          </span>
          <span>Weather<span className="brand-accent">ly</span></span>
        </a>
        <p>Weather, wherever you are.</p>
        <button
          type="button"
          className="theme-toggle"
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          aria-pressed={isDarkMode}
          onClick={() => setIsDarkMode((current) => !current)}
        >
          <i
            className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`}
            aria-hidden="true"
          />
          {isDarkMode ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <main className="dashboard">
        <SearchEngine query={query} setQuery={setQuery} search={search} />
        {weather.loading && (
          <p className="status-message" role="status">
            Finding your forecast...
          </p>
        )}
        {weather.error && (
          <p className="error-message" role="alert">
            We couldn’t find that city. Check the spelling and try again.
          </p>
        )}
        {!weather.loading && !weather.error && weather.data.condition && (
          <Forecast weather={weather} forecast={forecast} />
        )}
      </main>
      <Credit />
    </div>
  );
}

export default App;
