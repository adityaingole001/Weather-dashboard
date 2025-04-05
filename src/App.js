import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import SearchEngine from "./components/SearchEngine";
import Forecast from "./components/Forecast";
import "./styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [forecast, setForecast] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  
  // Memoized background class based on weather condition
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
    const currentTime = Date.now();

    // Rate limiter: wait 5 seconds between API requests
    if (currentTime - lastFetchTime < 5000) {
      console.warn("Rate limit reached, try again later.");
      return;
    }

    setLastFetchTime(currentTime);
    setWeather((prev) => ({ ...prev, loading: true }));

    const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${location}&key=${apiKey}`;
    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${location}&key=${apiKey}&units=metric`;

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl),
      ]);
      setWeather({ data: currentRes.data, loading: false, error: false });
      setForecast(forecastRes.data.daily);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error("Too many requests. Retrying after a delay...");
        setTimeout(() => fetchData(location), 10000); // Retry after 10 seconds
      } else {
        setWeather({ data: {}, loading: false, error: true });
        setForecast([]);
        console.error("error", error);
      }
    }
  }, [lastFetchTime]);

  // Initial fetch for Mumbai data
  useEffect(() => {
    fetchData("Mumbai");
  }, [fetchData]);

  return (
    <div className={`App ${backgroundClass}`}>
      <SearchEngine query={query} setQuery={setQuery} search={() => fetchData(query)} />
      {weather.loading && <h4>Searching..</h4>}
      {weather.error && (
        <span className="error-message">Sorry, city not found or rate limit exceeded. Please try again later.</span>
      )}
      {!weather.loading && !weather.error && weather.data && weather.data.condition && (
        <Forecast weather={weather} forecast={forecast} />
      )}
    </div>
  );
}

export default App;
