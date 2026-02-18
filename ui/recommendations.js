const WEATHER_ACTIVITIES = {
  Clear: {
    day: {
      text: "Cielo despejado",
      tasks: [
        {
          activity: "Jugar Pickelball",
          icon: "fa-person-running",
        },
        { activity: "Organizar un picnic", icon: "fa-basket-shopping" },
        { activity: "Salir a explorar la ciudad", icon: "fa-map-location-dot" },
      ],
    },
    night: {
      text: "Noche despejada",
      tasks: [
        { activity: "Jugar futbol", icon: "fa-star" },
        { activity: "Caminata nocturna tranquila", icon: "fa-moon" },
        { activity: "Terraza con amigos", icon: "fa-champagne-glasses" },
      ],
    },
  },
  Rain: {
    day: {
      text: "Día lluvioso",
      tasks: [
        { activity: "Visitar museos", icon: "fa-building-columns" },
        { activity: "Leer en una cafetería", icon: "fa-coffee" },
        { activity: "Ver una película", icon: "fa-film" },
      ],
    },
    night: {
      text: "Noche de lluvia",
      tasks: [
        { activity: "Ver una película de estreno", icon: "fa-film" },
        { activity: "Escuchar música relajante", icon: "fa-headphones" },
        { activity: "Cocinar algo nuevo", icon: "fa-utensils" },
      ],
    },
  },
  Drizzle: {
    day: {
      text: "Llovizna",
      tasks: [
        { activity: "Café y un buen libro", icon: "fa-coffee" },
        { activity: "Visitar una librería", icon: "fa-book" },
        { activity: "Trabajar desde casa", icon: "fa-laptop" },
      ],
    },
    night: {
      text: "Llovizna nocturna",
      tasks: [
        { activity: "Podcast o audiolibro", icon: "fa-headphones" },
        { activity: "Noche de series", icon: "fa-tv" },
        { activity: "Juegos de mesa", icon: "fa-chess-board" },
      ],
    },
  },
  Thunderstorm: {
    day: {
      text: "Tormenta",
      tasks: [
        { activity: "Quédate en casa", icon: "fa-house" },
        { activity: "Carga tus dispositivos", icon: "fa-bolt" },
        { activity: "Planea la semana", icon: "fa-calendar-check" },
      ],
    },
    night: {
      text: "Tormenta nocturna",
      tasks: [
        { activity: "Noche de películas", icon: "fa-film" },
        { activity: "Ten linternas a la mano", icon: "fa-lightbulb" },
        { activity: "Relájate en casa", icon: "fa-couch" },
      ],
    },
  },
  Snow: {
    day: {
      text: "Nevando",
      tasks: [
        { activity: "Abrígate bien antes de salir", icon: "fa-hat-winter" },
        { activity: "Chocolate caliente", icon: "fa-mug-hot" },
        { activity: "Fotos en la nieve", icon: "fa-camera" },
      ],
    },
    night: {
      text: "Noche de nieve",
      tasks: [
        { activity: "Cobija y película", icon: "fa-tv" },
        { activity: "Té o chocolate caliente", icon: "fa-mug-hot" },
        { activity: "Leer en casa", icon: "fa-book" },
      ],
    },
  },
  Clouds: {
    day: {
      text: "Día nublado",
      tasks: [
        { activity: "Sesión de fotos urbana", icon: "fa-camera" },
        { activity: "Paseo en bicicleta", icon: "fa-bicycle" },
        { activity: "Explorar un mercado local", icon: "fa-store" },
      ],
    },
    night: {
      text: "Noche nublada",
      tasks: [
        { activity: "Cena con amigos", icon: "fa-utensils" },
        { activity: "Noche de juegos de mesa", icon: "fa-chess-board" },
        { activity: "Bar con amigos", icon: "fa-beer-mug-empty" },
      ],
    },
  },
  Mist: {
    day: {
      text: "Neblina",
      tasks: [
        { activity: "Conduce con precaución", icon: "fa-car" },
        { activity: "Fotos atmosféricas", icon: "fa-camera" },
        { activity: "Café tranquilo en casa", icon: "fa-coffee" },
      ],
    },
    night: {
      text: "Neblina nocturna",
      tasks: [
        { activity: "Evita salir si puedes", icon: "fa-house" },
        { activity: "Noche de series en casa", icon: "fa-tv" },
        { activity: "Llamada con amigos o familia", icon: "fa-phone" },
      ],
    },
  },
  Fog: {
    day: {
      text: "Niebla densa",
      tasks: [
        { activity: "Evita salir si puedes", icon: "fa-house" },
        { activity: "Podcast o audiolibro", icon: "fa-headphones" },
        { activity: "Planea algo para mañana", icon: "fa-calendar-check" },
      ],
    },
    night: {
      text: "Niebla nocturna",
      tasks: [
        { activity: "No salgas, visibilidad nula", icon: "fa-house" },
        { activity: "Música y relax en casa", icon: "fa-headphones" },
        { activity: "Duerme temprano", icon: "fa-bed" },
      ],
    },
  },
};

const FALLBACK = {
  day: {
    text: "Clima variable",
    tasks: [
      { activity: "Revisa el pronóstico antes de salir", icon: "fa-cloud-sun" },
      { activity: "Lleva una chaqueta ligera", icon: "fa-shirt" },
      { activity: "Ten el paraguas a la mano", icon: "fa-umbrella" },
    ],
  },
  night: {
    text: "Clima variable",
    tasks: [
      { activity: "Revisa el pronóstico antes de salir", icon: "fa-cloud-sun" },
      { activity: "Lleva una chaqueta ligera", icon: "fa-shirt" },
      { activity: "Ten el paraguas a la mano", icon: "fa-umbrella" },
    ],
  },
};

export function renderRecommendations(weatherData) {
  const container = document.querySelector("#recommendations");
  if (!container) return;

  const main = weatherData.weather[0].main;
  const hour = new Date(weatherData.dt * 1000).getHours();
  const period = hour >= 6 && hour < 20 ? "day" : "night";
  const slot = (WEATHER_ACTIVITIES[main] ?? FALLBACK)[period];

  container.innerHTML = `
<div class="rounded-3xl p-6 shadow-md bg-cream border border-stone-200/80">
  <div class="flex items-center gap-2 mb-5">
    <span class="text-sm font-medium text-deep">Recomendaciones</span>
    <span class="ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-500">${slot.text}</span>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    ${slot.tasks
      .map(
        (task) => `
    <div class="flex items-center gap-3 bg-stone-200 border border-stone-300/50 rounded-2xl px-4 py-3">
      <div class="w-8 h-8 rounded-xl bg-cream flex items-center justify-center shrink-0">
        <i class="fa-solid ${task.icon} text-ocean text-sm"></i>
      </div>
      <span class="text-sm text-stone-600">${task.activity}</span>
    </div>`,
      )
      .join("")}
  </div>
</div>`;
}
