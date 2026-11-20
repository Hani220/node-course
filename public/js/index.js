/*eslint-disable  */
import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";

const mapElement = document.getElementById("map");

const initMap = () => {
  if (mapElement && typeof mapboxgl !== "undefined") {
    displayMap(JSON.parse(mapElement.dataset.locations));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMap);
} else {
  initMap();
}

const form = document.querySelector(".form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}
