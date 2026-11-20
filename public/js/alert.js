export const showAlert = (type, msg) => {
  let container = document.querySelector(".alert-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "alert-container";
    document.body.append(container);
  }

  const alert = document.createElement("div");
  alert.className = `alert alert--${type}`;
  alert.setAttribute("role", type === "error" ? "alert" : "status");
  alert.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

  const message = document.createElement("span");
  message.textContent = msg;

  const closeButton = document.createElement("button");
  closeButton.className = "alert__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Dismiss notification");
  closeButton.innerHTML = "&times;";

  const dismiss = () => {
    alert.classList.add("alert--closing");
    window.setTimeout(() => {
      alert.remove();

      if (!container.children.length) container.remove();
    }, 180);
  };

  closeButton.addEventListener("click", dismiss);
  alert.append(message, closeButton);
  container.append(alert);

  window.setTimeout(dismiss, 1500);
};
