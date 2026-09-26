import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

let datePickerInstance = null;

export function renderDatePicker() {
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

    minDate: "today",

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
