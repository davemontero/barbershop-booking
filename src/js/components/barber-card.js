import { renderIcon } from "./icon.js";

export function renderBarberCard(barber, selectedBarberId = null) {
  const isSelected = barber.id === selectedBarberId;

  const initials = barber.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  const barberImage = barber.image
    ? `
      <img
        class="barber-card__image"
        src="${barber.image}"
        alt="${barber.name}"
      >
    `
    : `
      <div
        class="barber-card__placeholder"
        aria-hidden="true"
      >
        ${initials}
      </div>
    `;

  return `
    <article
      class="barber-card ${isSelected ? "barber-card--selected" : ""}"
    >
      <div class="barber-card__media">
        ${barberImage}
      </div>

      <div class="barber-card__body">
        <h2 class="barber-card__name">
          ${barber.name}
        </h2>

        <p class="barber-card__role">
          ${barber.role}
        </p>

        <p class="barber-card__description">
          ${barber.description}
        </p>

        <button
          class="button button--primary barber-card__select"
          type="button"
          data-action="select-barber"
          data-barber-id="${barber.id}"
        >
          ${
            isSelected
              ? `
                Selected
                ${renderIcon("check")}
              `
              : `
                Select
                ${renderIcon("arrow-right")}
              `
          }
        </button>
      </div>
    </article>
  `;
}
