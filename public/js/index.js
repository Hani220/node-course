/*eslint-disable  */
import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
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

const form = document.querySelector(".form--login");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailField = form.querySelector("[name='email'], #email");
    const passwordField = form.querySelector("[name='password'], #password");

    if (!emailField || !passwordField) return;

    login(emailField.value, passwordField.value);
  });
}

const setupLogout = () => {
  const logoutButton = document.querySelector(".nav__el--logout");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLogout);
} else {
  setupLogout();
}

const userDataForm = document.querySelector(".form-user-data");

if (userDataForm) {
  userDataForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    updateSettings({ name, email }, "data");
  });
}

const userPasswordForm = document.querySelector(".form-user-settings");

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
    );

    document.getElementById("password-current").value = "";
    document.getElementById("password-new").value = "";
    document.getElementById("password-confirm").value = "";
    document.querySelector(".btn--save-password").textContent =
      "Save Password ";
  });
}
