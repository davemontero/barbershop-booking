import "../css/styles.css";

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

        ${renderServicePage()}
      </div>
    </main>
  `;
}

renderApp();
