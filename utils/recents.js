export function addRecentCity(city) {
  let recents = JSON.parse(localStorage.getItem("recents")) || [];
  recents = recents.filter((c) => !(c.lat === city.lat && c.lon === city.lon));
  recents.unshift(city);
  recents = recents.slice(0, 3);
  localStorage.setItem("recents", JSON.stringify(recents));
}
