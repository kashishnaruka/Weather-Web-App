import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './searchBar';
import { getWeatherData, getDailyTemp, getHourlyForeCast } from './weatherService';
import WeatherSummary from './weatherSummary';


function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [label, setLabel] = useState(null);
  const [unit, setUnit] = useState("0");

  const [labelData, setLabelData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [dailyTempData, setDailyTempData] = useState(null);
  const [hourlyForeCast, setHourlyForeCast] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeatherData(lat, lon);
      //console.log(data);
      setWeatherData(data);
      setLabelData(label);
      const daily_temp = await getDailyTemp(data.coord.lat, data.coord.lon);
      //console.log(daily_temp);
      setDailyTempData(daily_temp);
      const hourly_forecast = await getHourlyForeCast(data.coord.lat, data.coord.lon);
      //console.log(hourly_forecast);
      setHourlyForeCast(hourly_forecast);
    };

    if (lat != null && lon != null) {
      fetchWeather();
    }
  }, [lat, lon]);


  const handleInputValue = (coord, label) => {
    setLat(coord[0]);
    setLon(coord[1]);
    setLabel(label);
  };

  const handleUnitValue = (value) => {
    setUnit(value);
  }


  return (
    <div className="App mx-auto max-w-screen-md mt-4 py-5 px-16">
      <SearchBar onInputValue={handleInputValue} unitValue={handleUnitValue} />
      <WeatherSummary weatherData={weatherData} labelData={labelData} dailyTempData={dailyTempData} hourlyForeCast={hourlyForeCast} unitValue={unit} />
    </div>
  );
}

export default App;
