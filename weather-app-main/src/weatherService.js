const ROOT_OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/weather?lat='
const ROOT_OPENMETEO_URL = 'https://api.open-meteo.com/v1/forecast?latitude='
const API_KEY = 'c704e95a7a33d01511028b59f66c0345'

export const getWeatherData = (lat, lon) => {
    const url = new URL(ROOT_OPENWEATHERMAP_URL + lat + '&lon=' + lon + '&appid=' + API_KEY);
    return fetch(url).then((res) => res.json())
};

export const getDailyTemp = (lat, lon) => {
    const url = new URL(ROOT_OPENMETEO_URL + lat + '&longitude=' + lon +
        '&daily=temperature_2m_max,temperature_2m_min,sunrise,uv_index_max&timezone=auto');
    return fetch(url).then((res) => res.json())
};

export const getHourlyForeCast = (lat, lon) => {
    const url = new URL(ROOT_OPENMETEO_URL + lat + '&longitude=' + lon +
        '&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,is_day&current_weather=true&timezone=auto');
    return fetch(url).then((res) => res.json())
};

