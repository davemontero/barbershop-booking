import { services } from "../data/mock-data.js";
import { renderServiceCard } from "./service-card.js";

export function renderServicePage(selectedServiceId = null) {
  const serviceCards = services
    .map((service) => {
      return renderServiceCard(service, selectedServiceId);
    })
    .join("");

  return `
    <section class="booking-content">
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Select a Service
        </h1>

        <p class="booking-content__subtitle">
          Choose the service that best fits your appointment.
        </p>
      </header>

      <div class="service-list">
        ${serviceCards}
      </div>
    </section>
  `;
}
