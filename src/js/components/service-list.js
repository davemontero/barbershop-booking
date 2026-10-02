import { renderServiceCard } from "./service-card.js";

export function renderServiceList(services) {
  const serviceCards = services
    .map((service) => renderServiceCard(service))
    .join("");

  return `
    <div class="service-list">
      ${serviceCards}
    </div>
  `;
}
