import { renderBarberCard } from "./barber-card.js";
import { renderIcon } from "./icon.js";

export function renderBarberPage(
  barbers,
  selectedBarberId = null,
  barberPreference = null,
) {
  const barberCards = barbers
    .map((barber) => renderBarberCard(barber, selectedBarberId))
    .join("");

  const isFirstAvailable = barberPreference === "first-available";

  const canContinue = Boolean(selectedBarberId) || isFirstAvailable;

  return `
    <section class="booking-content barber-page">
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Who's Your Barber?
        </h1>

        <p class="booking-content__subtitle">
          Choose your preferred barber, or select first available.
        </p>
      </header>

      <div class="barber-list">
        ${barberCards}
      </div>

      <div class="barber-page__separator">
        <span></span>
        <strong>OR</strong>
        <span></span>
      </div>

      <button
        class="first-available ${
          isFirstAvailable ? "first-available--selected" : ""
        }"
        type="button"
        data-action="select-first-available"
        aria-pressed="${isFirstAvailable}"
      >
        <span class="first-available__icon">
          ${renderIcon("users")}
        </span>

        <span class="first-available__content">
          <strong>
            First Available
          </strong>

          <span>
            Book with the next available barber
          </span>
        </span>

        <span
          class="first-available__arrow"
          aria-hidden="true"
        >
          ${
            isFirstAvailable ? renderIcon("check") : renderIcon("chevron-right")
          }
        </span>
      </button>

      <div class="barber-page__actions">
        <button
          class="button button--text"
          type="button"
          data-action="back-to-service"
        >
          ${renderIcon("arrow-left")}
          Back
        </button>

        <button
          class="button button--primary"
          type="button"
          data-action="continue-to-date-time"
          ${canContinue ? "" : "disabled"}
        >
          Continue
          ${renderIcon("arrow-right")}
        </button>
      </div>
    </section>
  `;
}
