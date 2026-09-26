import { renderIcon } from "./icon.js";

export function renderServiceCard(service, selectedServiceId = null) {
  const isSelected = service.id === selectedServiceId;

  return `
    <button
      class="service-card ${isSelected ? "service-card--selected" : ""}"
      type="button"
      data-action="select-service"
      data-service-id="${service.id}"
      aria-pressed="${isSelected}"
    >
      <span class="service-card__icon">
        <img
          src="${service.icon}"
          alt=""
          aria-hidden="true"
        >
      </span>

      <span class="service-card__name">
        ${service.name}
      </span>

      <span class="service-card__details">
        <span class="service-card__duration">
          ${service.duration} min
        </span>

        <span class="service-card__description">
          ${service.description}
        </span>
      </span>

      <span class="service-card__price">
        $${service.price}
      </span>

      <span
        class="service-card__arrow"
        aria-hidden="true"
      >
        ${renderIcon("chevron-right")}
      </span>
    </button>
  `;
}
