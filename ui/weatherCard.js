function statItem(label, value, valueClass = "text-stone-700") {
  return `
<div class="rounded-2xl p-3 text-center bg-stone-200 border border-stone-300/50">
  <div class="text-xs font-medium mb-0.5 text-stone-500">${label}</div>
  <div class="text-sm font-semibold ${valueClass}">${value}</div>
</div>`;
}

export function weatherForecastCard(current, props) {
  const container = document.querySelector("#forecast");

  const nextItems = props.list.slice(0, 8);

  const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const humidity = current.main.humidity;
  const windSpeed = Math.round(current.wind.speed * 3.6);
  const pop = nextItems[0]?.pop ? Math.round(nextItems[0].pop * 100) : 0;
  const condition = current.weather[0].description;
  const nowHour = new Date().getHours();

  container.innerHTML = `
<div class="weather-card rounded-3xl p-6 shadow-md bg-cream border border-stone-200/80 w-full lg:w-80 flex flex-col h-full">

    <div class="flex items-start justify-between">
      <div>
        <div class="text-[10px] font-medium uppercase tracking-widest text-steel mb-1">Now</div>
        <div class="font-light leading-none text-7xl md:text-9xl text-deep">${temp}°</div>
        <div class="text-base font-semibold mt-1 text-deep">${current.name}, ${current.sys.country}</div>
      </div>
      <div class="flex flex-col items-end pt-1">
        <img src="${iconUrl}" alt="${condition}" class="w-20 h-20 drop-shadow-lg">
        <div class="text-sm font-medium capitalize mt-1 text-ocean">${condition}</div>
        <div class="text-xs mt-0.5 text-stone-400">Feels like ${feelsLike}°</div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-3 gap-2">
      ${statItem("Precip.", `${pop}%`, "text-ocean")}
      ${statItem("Humedad", `${humidity}%`)}
      ${statItem("Viento", `${windSpeed} km/h`)}
    </div>

    <div class="mt-5 flex gap-3 overflow-x-auto pb-1
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      ${nextItems.map((item) => weatherForecastItem(item, nowHour)).join("")}
    </div>

    <div class="mt-auto pt-4 flex justify-end">
      <button
        id="saveCityBtn"
        class="text-sm px-4 py-1.5 rounded-full font-medium bg-ocean text-cream hover:bg-steel transition-colors"
        data-city="${current.name}"
        data-lat="${current.coord.lat}"
        data-lon="${current.coord.lon}"
      >
        + Guardar ubicación
      </button>
    </div>
</div>`;
}

export function fiveDayForecast(props) {
  const container = document.querySelector("#dayForecast");
  const noonForecasts = props.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  );

  container.innerHTML = `
<div class="rounded-3xl p-10 shadow-md bg-cream border border-stone-200/80 h-full w-full">
  <div class="text-[10px] font-medium uppercase tracking-widest text-steel mb-4">Próximos 5 días</div>
  <div class="space-y-6">
    ${noonForecasts.map((day) => dayForecastItem(day)).join("")}
  </div>
</div>`;
}

function dayForecastItem(props) {
  const iconUrl = `https://openweathermap.org/img/wn/${props.weather[0].icon}@2x.png`;
  const tempMin = Math.round(props.main.temp_min);
  const tempMax = Math.round(props.main.temp_max);
  const humidity = props.main.humidity;
  const date = new Date(props.dt_txt);
  const weekday = new Intl.DateTimeFormat("es-MX", { weekday: "short" })
    .format(date)
    .replace(/\.$/, "");
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("es-MX", { month: "short" })
    .format(date)
    .replace(/\.$/, "");
  const label = `${weekday}, ${day} ${month}`;

  return `
<div class="flex items-center justify-between gap-2">
  <span class="text-sm lg:text-base font-medium text-stone-600 w-20 capitalize">${label}</span>

  <div class="flex items-center gap-1 text-stone-400">
    <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-current" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1,0,0,1,-4,-2)">
        <path d="M17.66,8L12.71,3.06C12.32,2.67 11.69,2.67 11.3,3.06L6.34,8C4.78,9.56 4,11.64 4,13.64C4,15.64 4.78,17.75 6.34,19.31C7.9,20.87 9.95,21.66 12,21.66C14.05,21.66 16.1,20.87 17.66,19.31C19.22,17.75 20,15.64 20,13.64C20,11.64 19.22,9.56 17.66,8ZM6,14C6.01,12 6.62,10.73 7.76,9.6L12,5.27L16.24,9.65C17.38,10.77 17.99,12 18,14C18.016,17.296 14.96,19.809 12,19.74C9.069,19.672 5.982,17.655 6,14Z" style="fill-rule:nonzero;"/>
      </g>
    </svg>
    <span class="text-xs lg:text-sm font-medium">${humidity}%</span>
  </div>

  <img src="${iconUrl}" alt="${props.weather[0].description}" class="w-9 h-9 lg:w-11 lg:h-11">

  <span class="text-sm lg:text-base font-medium text-stone-700 text-right whitespace-nowrap">
    <span class="text-stone-400">${tempMin}°</span>
    <span class="mx-0.5 text-stone-300">/</span>
    <span>${tempMax}°</span>
  </span>
</div>`;
}

export function weatherForecastItem(props, nowHour = -1) {
  const hour = new Date(props.dt_txt).getHours();
  const iconUrl = `https://openweathermap.org/img/wn/${props.weather[0].icon}@2x.png`;
  const temp = Math.round(props.main.temp);
  const pop = props.pop ? Math.round(props.pop * 100) : 0;
  const showPop = pop >= 20;

  return `
    <div class="forecast-item flex flex-col items-center flex-shrink-0 rounded-2xl px-3 py-2.5 min-w-[64px] cursor-default bg-stone-200 border border-stone-300/50">
      <span class="text-xs font-medium text-stone-500">${`${hour}:00`}</span>
      <img src="${iconUrl}" alt="${props.weather[0].description}" class="w-10 h-10">
      <span class="text-xs font-semibold ${showPop ? "text-ocean" : "text-transparent"}">${pop}%</span>
      <span class="text-sm font-semibold text-stone-800">${temp}°</span>
    </div>`;
}

const clockSVG = `<svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
const starSVG = `<svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>`;

function cityButton(city, iconSvg, iconColorClass) {
  return `
<button
  class="city-btn w-full text-left flex items-center gap-2.5 text-sm px-2.5 py-2 rounded-xl
         text-stone-600 hover:text-ocean transition-colors"
  data-city="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}"
>
  <span class="shrink-0 ${iconColorClass}">${iconSvg}</span>
  <span class="truncate">${city.name}</span>
</button>`;
}

export function renderSavedCities() {
  const list = document.querySelector("#savedCities");
  const empty = document.querySelector("#favEmpty");
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.length) {
    list.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");
  list.innerHTML = cities
    .map((c) => cityButton(c, starSVG, "text-steel"))
    .join("");
}

export function renderRecentCities() {
  const list = document.querySelector("#recentCities");
  const empty = document.querySelector("#recentEmpty");
  const recents = (JSON.parse(localStorage.getItem("recents")) || []).slice(
    0,
    3,
  );
  if (!list) return;
  if (!recents.length) {
    list.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");
  list.innerHTML = recents
    .map((c) => cityButton(c, clockSVG, "text-stone-400"))
    .join("");
}

export function saveCity(city) {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.some((c) => c.lat === city.lat && c.lon === city.lon)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}
