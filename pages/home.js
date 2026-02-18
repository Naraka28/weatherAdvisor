import {
  getCity,
  getCurrentWeather,
  getForecastWeather,
  ServiceError,
} from "../services/weather.service.js";
import {
  weatherForecastCard,
  renderRecentCities,
  fiveDayForecast,
} from "../ui/weatherCard.js";
import { renderRecommendations } from "../ui/recommendations.js";
import { addRecentCity } from "../utils/recents.js";

const ERROR_MESSAGES = {
  not_found:
    "No encontramos esa ciudad. Verifica el nombre e intenta de nuevo.",
  offline: "Sin conexión a internet. Revisa tu red e intenta de nuevo.",
  circuit_open:
    "El servicio está temporalmente no disponible. Intenta en unos segundos.",
  server: "Error del servidor. Por favor intenta de nuevo.",
  auth: "Error de autenticación con la API del clima.",
  validation: "Ingresa al menos 3 caracteres para buscar.",
  default: "Algo salió mal. Por favor intenta de nuevo.",
};

function getErrorMessage(err) {
  if (err instanceof ServiceError) {
    return ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES.default;
  }
  return ERROR_MESSAGES.default;
}

function validateInput(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { valid: false, error: null };
  if (trimmed.length < 3)
    return { valid: false, error: "Ingresa al menos 3 caracteres." };
  if (!/^[a-zA-ZÀ-ÿ\s\-',.]+$/.test(trimmed))
    return { valid: false, error: "Solo se permiten letras y espacios." };
  return { valid: true, error: null };
}

export function renderHomePage() {
  const input = document.querySelector("#searchInput");
  const box = document.querySelector("#suggestions");
  const spinner = document.querySelector("#searchSpinner");
  const errorSpan = document.querySelector("#errorMessage");

  function showError(msg) {
    errorSpan.textContent = msg;
    errorSpan.classList.remove("hidden");
  }

  function clearError() {
    errorSpan.classList.add("hidden");
    errorSpan.textContent = "";
  }

  const debounce = (fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  function renderSuggestions(list) {
    if (!list.length) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    box.innerHTML = list
      .map((city) => {
        const parts = [city.name, city.state, city.country].filter(Boolean);
        return `
      <button
        class="w-full text-left px-4 py-3 text-sm transition-colors"
        type="button"
        data-city="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}"
      >
        <span class="font-medium text-deep">${city.name}</span>
        <span class="text-stone-400 ml-1 text-xs">${parts.slice(1).join(", ")}</span>
      </button>`;
      })
      .join("");
    box.classList.remove("hidden");
  }

  async function handleSuggest(q) {
    spinner?.classList.remove("hidden");
    try {
      const results = await getCity(q);
      if (!results.length) {
        renderSuggestions([]);
        showError("No se encontraron ciudades con ese nombre.");
        return;
      }
      clearError();
      renderSuggestions(results);
    } catch (err) {
      renderSuggestions([]);
      showError(getErrorMessage(err));
    } finally {
      spinner?.classList.add("hidden");
    }
  }

  const debouncedSuggest = debounce(handleSuggest, 500);

  input.addEventListener("input", (e) => {
    const q = e.target.value;
    const { valid, error } = validateInput(q);

    if (!valid) {
      box.classList.add("hidden");
      if (error) showError(error);
      else clearError();
      return;
    }

    clearError();
    debouncedSuggest(q.trim());
  });

  box.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const { city, lat, lon } = btn.dataset;
    input.value = city;
    box.classList.add("hidden");
    clearError();

    await loadWeather({ name: city, lat, lon });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchForm")) box.classList.add("hidden");
  });

  async function loadWeather({ name, lat, lon }) {
    spinner?.classList.remove("hidden");
    try {
      const [forecast, current] = await Promise.all([
        getForecastWeather(lat, lon),
        getCurrentWeather(lat, lon),
      ]);
      weatherForecastCard(current, forecast);
      fiveDayForecast(forecast);
      renderRecommendations(current);
      addRecentCity({ name, lat, lon });
      renderRecentCities();
      clearError();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      spinner?.classList.add("hidden");
    }
  }
}
