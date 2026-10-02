import { renderBarberList } from "./barber-list.js";

import { renderFirstAvailableOption } from "./first-available-option.js";

import { renderStatusMessage } from "./status-message.js";

import { renderIcon } from "./icon.js";

export function renderBarberPage(viewState, bookingState) {
  const { barbers, status, error } = viewState;

  const content = renderBarberContent({
    barbers,
    status,
    error,
    bookingState,
  });

  return `
    <section
      class="booking-content barber-page"
    >
      <header
        class="booking-content__header"
      >
        <h1
          class="booking-content__title"
        >
          Who's Your Barber?
        </h1>

        <p
          class="booking-content__subtitle"
        >
          Choose your preferred barber,
          or select first available.
        </p>
      </header>

      ${content}
    </section>
  `;
}

function renderBarberContent({ barbers, status, error, bookingState }) {
  /*
   * LOADING
   */
  if (status === "idle" || status === "loading") {
    return `
      ${renderStatusMessage({
        type: "loading",

        variant: "panel",

        title: "Loading barbers...",

        message: "Please wait while we check who's available for this service.",
      })}

      ${renderBackButton()}
    `;
  }

  /*
   * ERROR
   */
  if (status === "error") {
    return `
      ${renderStatusMessage({
        type: "error",

        variant: "panel",

        title: "Unable to load barbers",

        message: error ?? "We couldn't load available barbers.",

        action: {
          label: "Try Again",
          action: "retry-barbers",
        },
      })}

      ${renderBackButton()}
    `;
  }

  /*
   * EMPTY
   */
  if (status === "success" && barbers.length === 0) {
    return `
      ${renderStatusMessage({
        type: "empty",

        variant: "panel",

        icon: "users",

        title: "No barbers available",

        message: "No staff members are currently available for this service.",

        action: {
          label: "Choose Another Service",

          action: "back-to-services",
        },
      })}
    `;
  }

  /*
   * SUCCESS
   */

  const selectedBarberId =
    bookingState.barberPreference === "specific"
      ? (bookingState.barber?.id ?? null)
      : null;

  const isFirstAvailableSelected =
    bookingState.barberPreference === "first-available";

  return `
    ${renderBarberList(barbers, selectedBarberId)}

    <div class="barber-page__separator">
      <span></span>
      <strong>OR</strong>
      <span></span>
    </div>

    ${renderFirstAvailableOption(isFirstAvailableSelected)}

    <div class="barber-page__actions">
      ${renderBackButton()}

      <button
        class="button button--primary"
        type="button"
        data-action="continue-to-date-time"
        ${hasBarberPreference(bookingState) ? "" : "disabled"}
      >
        Continue

        ${renderIcon("arrow-right")}
      </button>
    </div>
  `;
}

function hasBarberPreference(bookingState) {
  if (bookingState.barberPreference === "first-available") {
    return true;
  }

  return (
    bookingState.barberPreference === "specific" && Boolean(bookingState.barber)
  );
}

function renderBackButton() {
  return `
    <button
      class="button button--text"
      type="button"
      data-action="back-to-services"
    >
      ${renderIcon("arrow-left")}

      Back
    </button>
  `;
}
