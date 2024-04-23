import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import './App.css';

function SearchBar({ onInputValue, unitValue }) {

  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState("°C");

  const handleChange = (selectedOption) => {
    setLocation(selectedOption);
    onInputValue(selectedOption.coord, selectedOption.label);
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    unitValue(newUnit);
  };

  async function temp_func(search_param) {
    return await fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + search_param + "&lang=en&limit=5&type=state&format=json&apiKey=f2f56c29a7ca4cb38bdbda41130ae76e")
      .then(response => response.json())
  }
  const loadOptions = async (location) => {
    try {
      const responseData = await temp_func(location);
      const options = responseData.results.map((city) => ({
        value: `${city.address_line1}`,
        label: `${city.address_line1}, ${city.country}`,
        coord: [city.bbox ? (city.bbox.lat1 + city.bbox.lat2) / 2 : city.lat, city.bbox ? (city.bbox.lon1 + city.bbox.lon2) / 2 : city.lon],
      }));
      return { options };

    } catch (err) {
      console.error(err);
      return { options: [] };
    }
  };

  return (
    <div className="search-box flex flex-col sm:flex-row justify-center my-6">
      <AsyncPaginate
        className="search-bar w-full sm:w-72 mb-4 sm:mb-0 sm:mr-2"
        value={location}
        onChange={handleChange}
        debounceTimeout={1000}
        loadOptions={loadOptions}
        type="text"
        placeholder="Search City"
      />
      <div className="flex flex-row justify-center ">
        <button
          className="bg-unit-card text-gray-800 font-bold py-2 px-4 rounded-l-xl"
          onClick={() => handleUnitChange(0)}
        >
          °C
        </button>
        <button
          className="bg-unit-card text-gray-800 font-bold py-2 px-4 rounded-r-xl"
          onClick={() => handleUnitChange(1)}
        >
          °F
        </button>
      </div>
    </div>
  );
}

export default SearchBar;