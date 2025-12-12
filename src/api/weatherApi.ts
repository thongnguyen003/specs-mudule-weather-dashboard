// src/api/weatherApi.ts
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

export interface WeatherData {
  timezone?: string;
  timezone_offset?: number;
  current: any;
  hourly: any[];
  daily: any[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function getWeatherByCoords(lat: number, lon: number, units: "metric" | "imperial" = "metric") {
  const url = `${ONECALL_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  return (await fetchJson(url)) as WeatherData;
}

export async function getCurrentWeather(lat: number, lon: number, units: "metric" | "imperial" = "metric") {
  const data = await getWeatherByCoords(lat, lon, units);
  return data.current;
}

export async function getHourlyForecast(lat: number, lon: number, units: "metric" | "imperial" = "metric") {
  const data = await getWeatherByCoords(lat, lon, units);
  return data.hourly;
}

export async function getDailyForecast(lat: number, lon: number, units: "metric" | "imperial" = "metric") {
  const data = await getWeatherByCoords(lat, lon, units);
  return data.daily;
}

// convenience: search coords by city
export async function getCoordsByCity(city: string) {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
  const data = await fetchJson(url);
  if (!Array.isArray(data) || data.length === 0) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon };
}

// convenience: get current weather by city name
export async function getCurrentWeatherByCity(city: string, units: "metric" | "imperial" = "metric") {
  const coords = await getCoordsByCity(city);
  return await getCurrentWeather(coords.lat, coords.lon, units);
}

// convenience: daily 7
export async function getDaily7Forecast(lat: number, lon: number, units: "metric" | "imperial" = "metric") {
  const data = await getDailyForecast(lat, lon, units);
  return (data || []).slice(0,7);
}
