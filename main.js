import { renderHomePage } from "./pages/home.js";
import {
  getForecastWeather,
  getCurrentWeather,
  ServiceError,
} from "./services/weather.service.js";
import {
  renderSavedCities,
  renderRecentCities,
  saveCity,
  weatherForecastCard,
  fiveDayForecast,
} from "./ui/weatherCard.js";
import { renderRecommendations } from "./ui/recommendations.js";
import { addRecentCity } from "./utils/recents.js";

renderSavedCities();
renderRecentCities();
renderHomePage();

const errorSpan = document.querySelector("#errorMessage");

function showError(msg) {
  errorSpan.textContent = msg;
  errorSpan.classList.remove("hidden");
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-lat]");
  if (!btn || btn.id === "saveCityBtn") return;

  const { city, lat, lon } = btn.dataset;

  try {
    const [forecast, current] = await Promise.all([
      getForecastWeather(lat, lon),
      getCurrentWeather(lat, lon),
    ]);
    weatherForecastCard(current, forecast);
    fiveDayForecast(forecast);
    renderRecommendations(current);
    addRecentCity({ name: city, lat, lon });
    renderRecentCities();
    errorSpan.classList.add("hidden");
  } catch (err) {
    const msg =
      err instanceof ServiceError
        ? err.message
        : "No se pudo obtener el clima. Intenta de nuevo.";
    showError(msg);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id !== "saveCityBtn") return;
  const { city, lat, lon } = e.target.dataset;
  saveCity({ name: city, lat, lon });
  renderSavedCities();
});

document.querySelector("#clearCities").onclick = () => {
  localStorage.removeItem("cities");
  renderSavedCities();
};
