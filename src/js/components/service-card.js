import { renderIcon } from "./icon.js";

import { escapeHtml } from "../utils/escape-html.js";

export function renderServiceCard(service) {
  const { id, name, description, duration, price, icon } = service;

  return `
    <button
      class="service-card"
      type="button"
      data-action="select-service"
      data-service-id="${escapeHtml(id)}"
    >
      <span
        class="service-card__icon"
        aria-hidden="true"
      >
        <img
          src="${escapeHtml(icon)}"
          alt=""
        >
      </span>

      <span
        class="service-card__name"
      >
        ${escapeHtml(name)}
      </span>

      <span
        class="service-card__details"
      >
        <strong>
          ${duration} min
        </strong>

        <span>
          ${escapeHtml(description)}
        </span>
      </span>

      <strong
        class="service-card__price"
      >
        $${price}
      </strong>

      <span
        class="service-card__chevron"
        aria-hidden="true"
      >
        ${renderIcon("chevron-right")}
      </span>
    </button>
  `;
}
