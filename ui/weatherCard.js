export function weatherCard(props) {
  const container = document.querySelector("#current");
  const date = new Date(props.location.localtime).toDateString();
  container.innerHTML = `
<div class="min-h-screen flex items-center justify-center">
<div class="flex flex-col bg-white rounded p-4 w-full max-w-xs">
						<div class="font-bold text-xl">${props.location.name}</div>
						<div class="text-sm text-gray-500">${date}</div>
						<div class="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
                            <img src="https:${props.current.condition.icon}" alt="${props.current.condition.text} weather icon" class="w-32 h-32">
						</div>
						<div class="flex flex-row items-center justify-center mt-6">
							<div class="font-medium text-6xl">${props.current.temp_c}°</div>
							<div class="flex flex-col items-center ml-6">
								<div>${props.current.condition.text}</div>
								<div class="mt-1">
									<span class="text-sm"><i class="far fa-long-arrow-up"></i></span>
									<span class="text-sm font-light text-gray-500">${props.current.temp_c}°C</span>
								</div>
								<div>
									<span class="text-sm"><i class="far fa-long-arrow-down"></i></span>
									<span class="text-sm font-light text-gray-500">20°C</span>
								</div>
							</div>
						</div>
						<div class="flex flex-row justify-between mt-6">
							<div class="flex flex-col items-center">
								<div class="font-medium text-sm">Wind</div>
								<div class="text-sm text-gray-500">${props.current.wind_kph} km/h</div>
							</div>
							<div class="flex flex-col items-center">
								<div class="font-medium text-sm">Humidity</div>
								<div class="text-sm text-gray-500">${props.current.humidity}%</div>
							</div>
							<div class="flex flex-col items-center">
								<div class="font-medium text-sm">Visibility</div>
								<div class="text-sm text-gray-500">${props.current.vis_km}km</div>
							</div>
						</div>
					</div>
</div>

  `;
}

export function weatherForecastCard(current, props) {
  const container = document.querySelector("#forecast");

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const nextItems = props.list.filter((item) => {
    const d = new Date(item.dt_txt);
    return d >= now && d <= next24h;
  });

  const iconCode = current.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  container.innerHTML = `
  <div class="max-w-md p-8 mx-auto mt-16 rounded-lg bg-slate-100 text-gray-800 border shadow-md">
    
    <div class="flex justify-between">
      <div class="flex flex-col items-center">
        <img src="${iconUrl}" class="w-24 h-24">
        <h2 class="text-xl font-semibold">${current.name}</h2>
      </div>
      <span class="font-bold text-7xl">${current.main.temp}°</span>
    </div>

    <div class="mt-8 flex gap-6 overflow-x-auto pb-3">
      ${nextItems.map((day) => weatherForecastItem(day)).join("")}
    </div>

  </div>
  <div class="mt-4 flex justify-center">
  <button
    id="saveCityBtn"
    class="bg-indigo-500 text-white text-sm px-3 py-1 rounded hover:bg-indigo-600"
    data-city="${current.name}" data-lat="${current.coord.lat}" data-lon="${current.coord.lon}"
  >
    Guardar ubicación
  </button>
</div>
  `;
}

export function weatherForecastItem(props) {
  const hour = new Date(props.dt_txt).getHours();
  const iconCode = props.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return `
    <div class="flex flex-col items-center space-y-1">
			<span class="uppercase">${hour}:00</span>
            <img src="${iconUrl}" alt="Icono de ${props.weather[0].description} weather icon">
			<span>${props.main.temp}°</span>
		</div>
    `;
}

export function renderSavedCities() {
  const list = document.querySelector("#savedCities");
  const cities = JSON.parse(localStorage.getItem("cities")) || [];

  list.innerHTML = cities
    .map(
      (city) => `
    <button
      class="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
      data-city="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}"
    >
      ${city.name}
    </button>
  `,
    )
    .join("");
}

export function saveCity(city) {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];

  const exists = cities.some((c) => c.lat === city.lat && c.lon === city.lon);

  if (!exists) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}
