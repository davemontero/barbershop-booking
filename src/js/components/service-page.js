import { renderServiceCard } from "./service-card.js";

export function renderServicePage(services, selectedServiceId = null) {
  const serviceCards = services
    .map((service) => renderServiceCard(service, selectedServiceId))
    .join("");

  return `
    <section class="booking-content">
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Book Your Appointment
        </h1>

        <p class="booking-content__subtitle">
          Choose your service
        </p>
      </header>

      <div class="service-list">
        ${serviceCards}
      </div>
    </section>
  `;
}
