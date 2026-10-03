import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { renderStatusMessage } from "./status-message.js";
import { siteConfig } from "../config/site-config.js";
import { getDateInTimeZone } from "../utils/date-time.js";

let datePickerInstance = null;

export function renderDatePicker({
  status = "idle",
  errorMessage = null,
} = {}) {
  if (status === "loading") {
    return `
      <div class="date-picker">
        ${renderStatusMessage({
          icon: "loader",
          title: "Loading available dates",
          message: "Checking appointment availability...",
          loading: true,
        })}
      </div>
    `;
  }

  if (status === "error") {
    return `
      <div class="date-picker">
        ${renderStatusMessage({
          icon: "alert",
          title: "Unable to load dates",
          message: errorMessage ?? "Please try again in a moment.",
        })}
      </div>
    `;
  }

  if (status === "empty") {
    return `
      <div class="date-picker">
        ${renderStatusMessage({
          icon: "calendar",
          title: "No dates available",
          message: "Try another barber or service.",
        })}
      </div>
    `;
  }

  if (status !== "success") {
    return "";
  }

  return `
    <div class="date-picker">
      <input
        id="booking-date-picker"
        class="date-picker__input"
        type="text"
        aria-label="Select appointment date"
      >
    </div>
  `;
}

export function initializeDatePicker({
  element,
  availableDates,
  selectedDate,
  onChange,
}) {
  if (!element) {
    return;
  }

  destroyDatePicker();

  datePickerInstance = flatpickr(element, {
    inline: true,

    dateFormat: "Y-m-d",

    minDate: getDateInTimeZone(siteConfig.booking.timezone),

    enable: availableDates,

    defaultDate: selectedDate || undefined,

    disableMobile: true,

    monthSelectorType: "static",

    onChange: (selectedDates, dateString) => {
      if (dateString) {
        onChange(dateString);
      }
    },
  });

  /*
   * Show the month containing the
   * first available date without
   * automatically selecting it.
   */
  if (!selectedDate && availableDates.length > 0) {
    datePickerInstance.jumpToDate(availableDates[0]);
  }
}

export function destroyDatePicker() {
  if (!datePickerInstance) {
    return;
  }

  datePickerInstance.destroy();

  datePickerInstance = null;
}
