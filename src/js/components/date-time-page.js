import { renderDatePicker } from "./date-picker.js";

import { renderTimeSlots } from "./time-slots.js";

import { renderAppointmentSummary } from "./appointment-summary.js";

import { renderIcon } from "./icon.js";

export function renderDateTimePage(dateTimeViewState, bookingState) {
  const hasAssignedBarber =
    bookingState.barberPreference !== "first-available" || bookingState.barber;

  const hasValidStaffSelection =
    bookingState.barberPreference === "first-available" ||
    (bookingState.barberPreference === "specific" &&
      Boolean(bookingState.barber));

  const canContinue = Boolean(
    bookingState.date && bookingState.time && hasValidStaffSelection,
  );

  return `
    <section
      class="booking-content date-time-page"
    >
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Select Date & Time
        </h1>

        <p class="booking-content__subtitle">
          Choose an available date and time.
        </p>
      </header>
      ${
        dateTimeViewState.notice
          ? `
            <div
              class="date-time-page__notice"
              role="status"
            >
              ${dateTimeViewState.notice}
            </div>
          `
          : ""
      }
      <div class="date-time-page__layout">
        <section class="date-time-panel">
          <h2 class="date-time-panel__title">
            Select a Date
          </h2>

          ${renderDatePicker({
            status: dateTimeViewState.datesStatus,

            errorMessage: dateTimeViewState.datesError,
          })}
        </section>

        <section class="date-time-panel">
          <h2 class="date-time-panel__title">
            Available Times
          </h2>

          ${renderTimeSlots({
            times: dateTimeViewState.availableTimes,

            selectedTime: bookingState.time,

            status: dateTimeViewState.timesStatus,

            errorMessage: dateTimeViewState.timesError,
          })}
        </section>

        ${renderAppointmentSummary(bookingState)}
      </div>

      <div class="date-time-page__actions">
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
