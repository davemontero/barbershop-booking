import { renderDatePicker } from "./date-picker.js";

import { renderTimeSlots } from "./time-slots.js";

import { renderAppointmentSummary } from "./appointment-summary.js";

import { renderIcon } from "./icon.js";

export function renderDateTimePage(availableTimes, bookingState) {
  const canContinue = Boolean(bookingState.date && bookingState.time);

  return `
    <section
      class="booking-content date-time-page"
    >
      <header
        class="booking-content__header"
      >
        <h1
          class="booking-content__title"
        >
          Select Date & Time
        </h1>

        <p
          class="booking-content__subtitle"
        >
          Choose an available date and time.
        </p>
      </header>

      <div
        class="date-time-page__layout"
      >
        ${renderDatePicker()}

        <div
          class="date-time-page__times"
        >
          <h2>
            Available Times
          </h2>

          ${renderTimeSlots(availableTimes, bookingState.time)}
        </div>

        ${renderAppointmentSummary(bookingState)}
      </div>

      <div
        class="date-time-page__actions"
      >
        <button
          class="button button--text"
          type="button"
          data-action="back-to-barber"
        >
          ${renderIcon("arrow-left")}

          Back
        </button>

        <button
          class="button button--primary"
          type="button"
          data-action="continue-to-details"
          ${canContinue ? "" : "disabled"}
        >
          Continue

          ${renderIcon("arrow-right")}
        </button>
      </div>
    </section>
  `;
}
