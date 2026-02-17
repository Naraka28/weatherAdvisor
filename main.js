import { renderHomePage } from "./pages/home.js";
import {
  getForecastWeather,
  getCity,
  getCurrentWeather,
} from "./services/weather.service.js";
import {
  renderSavedCities,
  saveCity,
  weatherForecastCard,
} from "./ui/weatherCard.js";

renderSavedCities();

renderHomePage();
document.addEventListener("click", async (e) => {
  if (e.target.dataset.city) {
    const lat = e.target.dataset.lat;
    const lon = e.target.dataset.lon;
    const data = await getForecastWeather(lat, lon);
    const current = await getCurrentWeather(lat, lon);
    weatherForecastCard(current, data);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.id === "saveCityBtn") {
    const city = {
      name: e.target.dataset.city,
      lat: e.target.dataset.lat,
      lon: e.target.dataset.lon,
    };

    saveCity(city);
    renderSavedCities();
  }
});

document.querySelector("#clearCities").onclick = () => {
  localStorage.removeItem("cities");
  renderSavedCities();
};
