import { renderHomePage } from "./pages/home.js";
import { getForecastWeather, getCity } from "./services/weather.service.js";
import {
  renderSavedCities,
  saveCity,
  weatherForecastCard,
} from "./ui/weatherCard.js";

renderSavedCities();

renderHomePage();

// document.addEventListener("click", async (e) => {
//   if (e.target.dataset.city) {
//     const city = e.target.dataset.city;
//     const data = await getForecastWeather(city);
//     weatherForecastCard(data);
//   }
// });
document.addEventListener("click", (e) => {
  if (e.target.id === "saveCityBtn") {
    const city = e.target.dataset.city;
    saveCity(city);
    renderSavedCities();
  }
});
document.querySelector("#clearCities").onclick = () => {
  localStorage.removeItem("cities");
  renderSavedCities();
};
