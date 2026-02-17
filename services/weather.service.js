import { API_KEY } from "../env.js";
const apiKey = API_KEY;

export async function getForecastWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Error");
  }
  return await response.json();
}

export async function getCurrentWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error();
  }
  return await response.json();
}

export async function getCity(search) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error("Error");
  }
  return await response.json();
}
