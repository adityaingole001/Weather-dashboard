import React, { useState } from "react";

function Forecast({ weather, forecast }) {
  const { data } = weather;
  const [isCelsius, setIsCelsius] = useState(true);

  const formatDay = (timestamp) => {
    const options = { weekday: "short" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const formatTemperature = (temperature) => {
    if (typeof temperature !== "number" || !Number.isFinite(temperature)) return "—";
    const displayedTemperature = isCelsius
      ? temperature
      : (temperature * 9) / 5 + 32;
    return Math.round(displayedTemperature);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="weather-content" aria-label="Weather forecast">
      <div className="city-name">
        <p className="eyebrow">CURRENT WEATHER</p>
        <h1>
          {data.city}, <span>{data.country}</span>
        </h1>
        <p className="date">{currentDate}</p>
      </div>

      <div className="current-weather">
        <div className="temperature">
          {data.condition.icon_url && (
            <img
              src={data.condition.icon_url}
              alt=""
              className="temp-icon"
            />
          )}
          <span className="temp-value">
            {formatTemperature(data.temperature.current)}
            <span className="temp-unit">°{isCelsius ? "C" : "F"}</span>
          </span>
        </div>
        <div className="condition">
          <p className="weather-des">{data.condition.description}</p>
          <button
            type="button"
            className="unit-toggle"
            onClick={() => setIsCelsius((current) => !current)}
            aria-label={`Switch to ${isCelsius ? "Fahrenheit" : "Celsius"}`}
          >
            Show °{isCelsius ? "F" : "C"}
          </button>
        </div>
      </div>

      <div className="weather-info" aria-label="Weather details">
        <div className="detail-card" style={{border:'1px solid skyblue', borderRadius:'10px', padding:'10px', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.1), text-align: center'}}>
          <span className="detail-icon" aria-hidden="true">
            <i className="fas fa-droplet" />
          </span>
          <div>
            <p className="detail-label">Humidity</p>
            <p className="detail-value">
              {typeof data.temperature.humidity === "number"
                ? `${Math.round(data.temperature.humidity)}%`
                : "—"}
            </p>
          </div>
        </div>
        <div className="detail-card" style={{border:'1px solid skyblue', borderRadius:'10px', padding:'10px', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.1)'}}>
          <span className="detail-icon" aria-hidden="true">
            <i className="fas fa-wind" />
          </span>
          <div>
            <p className="detail-label">Wind speed</p>
            <p className="detail-value">
              {typeof data.wind.speed === "number"
                ? `${data.wind.speed} m/s`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <section className="forecast" aria-labelledby="forecast-title">
        <div className="section-heading">
          <h2 id="forecast-title">5-day forecast</h2>
          <span>Daily high / low</span>
        </div>
        <div className="forecast-container">
          {forecast.slice(0, 5).map((day) => (
            <div className="day" key={day.time} style={{border:'1px solid skyblue', borderRadius:'5px', padding:'10px', margin:'5px', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.1)'}}>
              <p className="day-name">{formatDay(day.time)}</p>
              {day.condition.icon_url && (
                <img
                  className="day-icon"
                  src={day.condition.icon_url}
                  alt=""
                />
              )}
              <p className="day-temperature">
                <span className="high-temperature">
                  {formatTemperature(day.temperature.maximum)}°
                </span>
                <span className="low-temperature">
                  {formatTemperature(day.temperature.minimum)}°
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Forecast;
