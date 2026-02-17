import {
  getCity,
  getCurrentWeather,
  getForecastWeather,
} from "../services/weather.service.js";
import { weatherForecastCard } from "../ui/weatherCard.js";

export function renderHomePage() {
  const input = document.querySelector("#searchInput");
  const box = document.querySelector("#suggestions");
  const errorSpan = document.querySelector("#errorMessage");

  const debounce = (callback, wait) => {
    let timeoutId = null;

    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), wait);
    };
  };

  function renderSuggestions(list) {
    if (!list.length) {
      box.classList.add("hidden");
      return;
    }

    box.innerHTML = list
      .map(
        (city) => `
      <button
        class="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
        type="button"
        data-city="${city.name}"
        data-lat="${city.lat}"
        data-lon="${city.lon}"
      >
        ${city.name}, ${city.state}, ${city.country}
      </button>
    `,
      )
      .join("");

    box.classList.remove("hidden");
  }

  async function handleSuggest(query) {
    try {
      const results = await getCity(query);
      renderSuggestions(results);
    } catch (err) {
      console.error(err);
    }
  }

  const debouncedSuggest = debounce(handleSuggest, 500);

  input.addEventListener("input", (e) => {
    const q = e.target.value.trim();

    if (q.length < 3) {
      box.classList.add("hidden");
      return;
    }

    debouncedSuggest(q);
  });

  box.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const city = btn.dataset.city;
    const lat = btn.dataset.lat;
    const lon = btn.dataset.lon;

    input.value = city;
    box.classList.add("hidden");

    try {
      const data = await getForecastWeather(lat, lon);
      const current = await getCurrentWeather(lat, lon);
      console.log("Current info:", current);
      console.log("Box info:", data);
      weatherForecastCard(current, data);
    } catch (err) {
      console.error(err);
      errorSpan.textContent = "No se pudo obtener el clima";
      errorSpan.classList.remove("hidden");
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchForm")) {
      box.classList.add("hidden");
    }
  });
}
