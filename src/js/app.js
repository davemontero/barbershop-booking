import "../css/styles.css";

import { services } from "./data/mock-data.js";
import { bookingState } from "./state.js";

import { renderHeader } from "./components/header.js";
import { renderProgressStepper } from "./components/progress-stepper.js";
import { renderServicePage } from "./components/service-page.js";

const app = document.querySelector("#app");

function renderApp() {
  app.innerHTML = `
    ${renderHeader()}

    <main class="booking-main">
      <div class="container">
        ${renderProgressStepper(bookingState.currentStep)}

        ${renderServicePage(bookingState.service?.id)}
      </div>
    </main>
  `;
}

function selectService(serviceId) {
  const selectedService = services.find((service) => service.id === serviceId);

  if (!selectedService) {
    return;
  }

  bookingState.service = selectedService;

  renderApp();

  console.log("Selected service:", bookingState.service);
}

app.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-service"]');

  if (!button) {
    return;
  }

  selectService(button.dataset.serviceId);
});

renderApp();
