const API_KEY = process.env.API_KEY;

const circuitBreaker = {
  state: "CLOSED",
  failureCount: 0,
  failureThreshold: 3,
  successThreshold: 1,
  timeout: 30_000,
  nextAttempt: null,

  recordSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  },

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
      console.warn(`CircuitBreaker OPEN — esperando ${this.timeout / 1000}s`);
    }
  },

  canRequest() {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN") {
      if (Date.now() >= this.nextAttempt) {
        this.state = "HALF_OPEN";
        console.info("CircuitBreaker HALF_OPEN — probando conexión...");
        return true;
      }
      return false;
    }
    return true;
  },
};

async function fetchWithRetry(url, retries = 3, baseDelay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    if (!circuitBreaker.canRequest()) {
      const secs = Math.round((circuitBreaker.nextAttempt - Date.now()) / 1000);
      throw new ServiceError(
        "circuit_open",
        `Servicio no disponible. Reintentando en ${secs}s.`,
      );
    }

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        circuitBreaker.recordSuccess();
        throw new ServiceError("not_found", "Ciudad no encontrada.");
      }

      if (response.status === 401) {
        circuitBreaker.recordSuccess();
        throw new ServiceError("auth", "API key inválida.");
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      circuitBreaker.recordSuccess();
      return await response.json();
    } catch (err) {
      if (err instanceof ServiceError) throw err;

      const isLastAttempt = attempt === retries;
      circuitBreaker.recordFailure();

      if (isLastAttempt) {
        if (!navigator.onLine) {
          throw new ServiceError("offline", "Sin conexión a internet.");
        }
        throw new ServiceError(
          "server",
          `Error del servidor después de ${retries} intentos.`,
        );
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Intento ${attempt} fallido. Reintentando en ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export class ServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export async function getForecastWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchWithRetry(url);
}

export async function getCurrentWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return fetchWithRetry(url);
}

export async function getCity(search) {
  if (!search || search.trim().length < 2) {
    throw new ServiceError("validation", "Ingresa al menos 2 caracteres.");
  }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(search)}&limit=8&appid=${API_KEY}`;
  return fetchWithRetry(url);
}
