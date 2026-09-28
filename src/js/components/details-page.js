import { renderCustomerForm } from "./customer-form.js";

import { renderAppointmentSummary } from "./appointment-summary.js";

import { renderIcon } from "./icon.js";

export function renderDetailsPage(bookingState, submissionState) {
  const isSubmitting = submissionState.status === "loading";

  return `
    <section
      class="booking-content details-page"
    >
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Almost Done.
        </h1>

        <p class="booking-content__subtitle">
          Please provide your information to confirm your appointment.
        </p>
      </header>

      <div class="details-page__layout">
        <div class="details-page__form-column">
          ${renderCustomerForm(bookingState.customer)}

          ${
            submissionState.status === "error"
              ? `
                <div
                  class="details-page__error"
                  role="alert"
                >
                  <strong>
                    We couldn't confirm your appointment.
                  </strong>

                  <p>
                    ${
                      submissionState.error ??
                      "Please check your information and try again."
                    }
                  </p>
                </div>
              `
              : ""
          }
        </div>

        ${renderAppointmentSummary(bookingState)}
      </div>

      <div class="details-page__actions">
        <button
          class="button button--text"
          type="button"
          data-action="back-to-date-time"
          ${isSubmitting ? "disabled" : ""}
        >
          ${renderIcon("arrow-left")}
          Back
        </button>

        <button
          class="button button--primary"
          type="submit"
          form="customer-details-form"
          ${isSubmitting ? "disabled" : ""}
        >
          ${isSubmitting ? "Confirming..." : "Confirm Appointment"}

          ${isSubmitting ? "" : renderIcon("arrow-right")}
        </button>
      </div>
    </section>
  `;
}
