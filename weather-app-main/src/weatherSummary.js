import React from "react";
import './App.css';

function WeatherSummary({ weatherData, labelData, dailyTempData, hourlyForeCast, unitValue }) {


    if (!weatherData || !dailyTempData || !hourlyForeCast) {
        return null;
    }

    const { main, weather } = weatherData;
    weather[0].description = weather[0].description[0].toUpperCase() + weather[0].description.substr(1);

    function kelvin_to_unit(temp, unitValue) {
        switch (unitValue) {
            case 0:
                return Math.floor(temp - 273.15);
            case 1:
                return Math.floor((temp - 273.15) * 9 / 5 + 32);
            default:
                return Math.floor(temp - 273.15);
        }
    }
    function celsius_to_unit(temp, unitValue) {
        switch (unitValue) {
            case 0:
                return Math.floor(temp);
            case 1:
                return Math.floor(((temp * 9) / 5) + 32);
            default:
                return Math.floor(temp);
        }
    }
    function unitDisplay(unitValue) {
        switch (unitValue) {
            case 0:
                return "°C";
            case 1:
                return "°F";
            default:
                return "°C";
        }
    }

    function getCurrentTimeStampIndex(hourlyForeCast) {
        for (let i = 0; i <= 24; i++) {
            if (hourlyForeCast.hourly.time[i].substring(0, 13) === hourlyForeCast.current_weather.time.substring(0, 13)) {
                return i;
            }
        }
    };

    function HourlyForeCastComponent(props) {
        let dateElement = null;

        if (props.timestamp.substring(11, 16) === "00:00") {
            dateElement = <div className="font-bold text-l">{props.timestamp.substring(5, 10)}</div>;
        } else if (props.index == getCurrentTimeStampIndex(hourlyForeCast)) {
            dateElement = <div className="font-bold text-l">Now</div>;
        } else {
            dateElement = <div className="font-bold text-l">&nbsp;</div>;
        }


        return (
            <div className="px-6 py-2">
                {dateElement}
                <div className="font-bold text-xl">{props.timestamp.substring(11, 16)}</div>
                <img alt="weather-icon" src={`icons/${props.weatherIconID}${props.weatherIconIsDay}.png`} />
                <div className="text-black text-base mt-1">
                    {celsius_to_unit(Math.floor(props.temp), unitValue)} {unitDisplay(unitValue)}
                </div>
            </div>
        );
    };


    function hourlyForeCastComponentCreation() {
        let arr = [];
        for (let i = getCurrentTimeStampIndex(hourlyForeCast); i <= 167; i++) {
            let hourly = hourlyForeCast.hourly;
            arr.push(
                <HourlyForeCastComponent
                    key={i}
                    index={i}
                    timestamp={hourly.time[i]}
                    temp={hourly.temperature_2m[i]}
                    weatherIconID={convertWeatherIcon(hourly.weathercode[i])}
                    weatherIconIsDay={checkHourlyForeCastIsDay(hourly.is_day[i])}
                />);
        }
        return arr;
    };

    function convertWeatherIcon(api1Code) {
        const api1ToApi2Mapping = {
            "0": "01",  // Clear sky
            "1": "02", // Few clouds
            "2": "02",
            "3": "02",
            "45": "50", // Fog
            "48": "50",
            "51": "09", // Shower rain
            "53": "09",
            "55": "09",
            "61": "10", // Rain
            "63": "10",
            "65": "10",
            "80": "09", // Shower rain
            "81": "09",
            "82": "09",
            "95": "11", // Thunderstorm
            "96": "11",
            "99": "11",
        };
        return api1ToApi2Mapping[api1Code];
    };

    function checkHourlyForeCastIsDay(hourlyForeCast) {
        if (hourlyForeCast === 0) return "n";
        else return "d";
    }

    return (
        <div>
            <div className='flex items-center justify-center mt-32'>
                <img alt="weather-icon" src={`icons/${weather[0].icon}.png`} />
            </div>

            <div className='flex items-center justify-center mt-8'>
                <h1 className='text-black text-xl font-bold'>{labelData}</h1>
            </div>
            <div className='flex items-center justify-center mt-4'>
                <p className='text-black text-4xl font-bold'>{kelvin_to_unit(main.temp, unitValue)} {unitDisplay(unitValue)}</p>
            </div>
            <div className='flex flex-row items-center justify-center mt-2'>
                <p className='text-black text-lg'>{weather[0].description}</p>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <p className='text-black text-lg'>
                    High: {celsius_to_unit(Math.floor(dailyTempData.daily.temperature_2m_max[0]), unitValue)} {unitDisplay(unitValue)} |
                    Low: {celsius_to_unit(Math.floor(dailyTempData.daily.temperature_2m_min[0]), unitValue)} {unitDisplay(unitValue)}
                </p>
            </div>
            <div className="flex flex-col">
                <div className="overflow-hidden">
                    <div className="flex flex-row rounded overflow-x-auto text-black shadow-lg mt-24 bg-hourly-card">
                        {hourlyForeCastComponentCreation()}
                    </div>
                </div>
                <div className="flex flex-wrap mt-36 text-black items-center justify-center">
                    <div className="flex flex-col w-full items-center justify-center">
                        <div className="bg-card w-1/2 rounded-tl">
                            <div className="mb-8">
                                <div className="font-bold text-xl mb-2">UV Index</div>
                                <p className="text-base">{dailyTempData.daily.uv_index_max[0]}</p>
                            </div>
                        </div>
                        <div className="bg-card w-1/2 rounded-tr">
                            <div className="mb-8">
                                <div className="font-bold text-xl mb-2">Sun Rise</div>
                                <p className="text-base">{dailyTempData.daily.sunrise[0].substring(11, 16)} A.M.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-center justify-center">
                        <div className="bg-card w-1/2 rounded-bl">
                            <div className="mb-8">
                                <div className="font-bold text-xl mb-2">Feels Like</div>
                                <p className="text-base">{celsius_to_unit(hourlyForeCast.hourly.apparent_temperature[getCurrentTimeStampIndex(hourlyForeCast)], unitValue)} {unitDisplay(unitValue)}</p>
                            </div>
                        </div>

                        <div className="bg-card w-1/2 rounded-br">
                            <div className="mb-8">
                                <div className="font-bold text-xl mb-2">Humidity</div>
                                <p className="text-base">{hourlyForeCast.hourly.relativehumidity_2m[getCurrentTimeStampIndex(hourlyForeCast)]}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherSummary;