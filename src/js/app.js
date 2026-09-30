import "../css/styles.css";

import { bookingState } from "./state.js";

import { renderHeader } from "./components/header.js";
import { renderProgressStepper } from "./components/progress-stepper.js";
import { renderServicePage } from "./components/service-page.js";
import { renderDateTimePage } from "./components/date-time-page.js";
import { renderBarberPage } from "./components/barber-page.js";
import { renderDetailsPage } from "./components/details-page.js";
import { renderConfirmationPage } from "./components/confirmation-page.js";
import { bookingService } from "./booking/booking-service.js";
import { buildAppointmentRequest } from "./booking/build-appointment-request.js";
import { BOOKING_ERROR_CODES } from "./booking/booking-error.js";

import {
  initializeDatePicker,
  destroyDatePicker,
} from "./components/date-picker.js";

const app = document.querySelector("#app");

const dateTimeViewState = {
  availableDates: [],
  datesStatus: "idle",
  datesError: null,
  notice: null,

  availableTimes: [],
  timesStatus: "idle",
  timesError: null,
};

const appointmentSubmissionState = {
  status: "idle",

  error: null,

  errorCode: null,

  retryable: false,
};

let datesRequestId = 0;
let timesRequestId = 0;
let renderRequestId = 0;
let serviceSelectionRequestId = 0;
let barberSelectionRequestId = 0;

// Renders

async function renderCurrentStep() {
  switch (bookingState.currentStep) {
    case 1: {
      const services = await bookingService.getServices();

      return renderServicePage(services, bookingState.service?.id);
    }

    case 2: {
      const barbers = await bookingService.getBarbersForService(
        bookingState.service.id,
      );

      const selectedBarberId =
        bookingState.barberPreference === "specific"
          ? bookingState.barber?.id
          : null;

      return renderBarberPage(
        barbers,
        selectedBarberId,
        bookingState.barberPreference,
      );
    }

    case 3: {
      return renderDateTimePage(dateTimeViewState, bookingState);
    }

    case 4: {
      return renderDetailsPage(bookingState, appointmentSubmissionState);
    }
    case 5: {
      return renderConfirmationPage(bookingState);
    }

    default:
      return "";
  }
}

async function renderApp() {
  const requestId = ++renderRequestId;
  const currentStepMarkup = await renderCurrentStep();

  if (requestId !== renderRequestId) {
    return;
  }

  destroyDatePicker();

  const isConfirmation = bookingState.currentStep === 5;

  app.innerHTML = `
    ${renderHeader()}

    <main class="booking-main">
      ${
        isConfirmation
          ? currentStepMarkup
          : `
            <div class="container">
              ${renderProgressStepper(bookingState.currentStep)}

              ${currentStepMarkup}
            </div>
          `
      }
    </main>
  `;

  if (requestId !== renderRequestId) {
    return;
  }

  await initializeCurrentStep();
}

async function initializeCurrentStep() {
  if (bookingState.currentStep !== 3) {
    return;
  }

  if (dateTimeViewState.datesStatus !== "success") {
    return;
  }

  initializeDatePicker({
    element: document.querySelector("#booking-date-picker"),

    availableDates: dateTimeViewState.availableDates,

    selectedDate: bookingState.date,

    onChange: selectDate,
  });
}

// SELECTION HANDLERS

async function selectService(serviceId) {
  const requestId = ++serviceSelectionRequestId;
  const services = await bookingService.getServices();

  if (requestId !== serviceSelectionRequestId) {
    return;
  }

  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return;
  }

  bookingState.service = service;

  bookingState.barber = null;

  bookingState.barberPreference = null;

  bookingState.date = null;

  bookingState.time = null;

  bookingState.appointment = null;

  bookingState.currentStep = 2;

  await renderApp();
}

async function selectBarber(barberId) {
  const requestId = ++barberSelectionRequestId;

  const serviceId = bookingState.service?.id;

  if (!serviceId) {
    return;
  }

  const barbers = await bookingService.getBarbersForService(serviceId);

  if (requestId !== barberSelectionRequestId) {
    return;
  }

  if (bookingState.service?.id !== serviceId) {
    return;
  }

  const barber = barbers.find((item) => item.id === barberId);

  if (!barber) {
    return;
  }

  bookingState.barber = barber;

  bookingState.barberPreference = "specific";

  bookingState.date = null;

  bookingState.time = null;

  bookingState.appointment = null;

  await renderApp();
}

async function selectDate(date) {
  dateTimeViewState.notice = null;

  bookingState.date = date;
  bookingState.time = null;

  if (bookingState.barberPreference === "first-available") {
    bookingState.barber = null;
  }

  await loadAvailableTimes();
}

async function selectTime(time) {
  bookingState.time = time;

  if (bookingState.barberPreference === "first-available")
    bookingState.barber = null;

  await renderApp();
}

async function selectFirstAvailable() {
  barberSelectionRequestId += 1;

  bookingState.barber = null;

  bookingState.barberPreference = "first-available";

  bookingState.date = null;
  bookingState.time = null;
  bookingState.appointment = null;

  await renderApp();
}

// BACK AND CONTINUE HANDLERS

async function backToService() {
  serviceSelectionRequestId += 1;
  barberSelectionRequestId += 1;

  bookingState.currentStep = 1;

  await renderApp();
}

async function backToBarber() {
  bookingState.currentStep = 2;

  await renderApp();
}

async function backToDateTime() {
  bookingState.currentStep = 3;

  await renderApp();
}

async function backToDetails() {
  if (appointmentSubmissionState.status === "loading") {
    return;
  }

  appointmentSubmissionState.status = "idle";

  appointmentSubmissionState.error = null;

  await renderApp();
}

async function continueToDateTime() {
  const hasBarber =
    bookingState.barber || bookingState.barberPreference === "first-available";

  if (!hasBarber) {
    return;
  }

  bookingState.currentStep = 3;

  resetDateTimeViewState();

  await loadAvailableDates();
}

async function continueToDetails() {
  const hasDateAndTime = bookingState.date && bookingState.time;

  const hasValidStaffSelection =
    bookingState.barberPreference === "first-available" ||
    (bookingState.barberPreference === "specific" &&
      Boolean(bookingState.barber));

  if (!hasDateAndTime || !hasValidStaffSelection) {
    return;
  }

  bookingState.currentStep = 4;

  appointmentSubmissionState.status = "idle";

  appointmentSubmissionState.error = null;
  appointmentSubmissionState.errorCode = null;
  appointmentSubmissionState.retryable = false;

  await renderApp();
}

async function confirmAppointment() {
  if (appointmentSubmissionState.status === "loading") {
    return;
  }

  appointmentSubmissionState.status = "loading";
  appointmentSubmissionState.error = null;
  appointmentSubmissionState.errorCode = null;
  appointmentSubmissionState.retryable = false;

  await renderApp();

  try {
    const appointmentRequest = buildAppointmentRequest(bookingState);

    const appointment =
      await bookingService.createAppointment(appointmentRequest);

    bookingState.appointment = appointment;

    appointmentSubmissionState.status = "success";

    bookingState.currentStep = 5;

    await renderApp();
  } catch (error) {
    if (error.code === BOOKING_ERROR_CODES.SLOT_UNAVAILABLE) {
      const notice =
        error.userMessage ??
        "That appointment time is no longer available. Please choose another time.";

      bookingState.date = null;
      bookingState.time = null;

      appointmentSubmissionState.status = "idle";
      appointmentSubmissionState.error = null;
      appointmentSubmissionState.errorCode = null;
      appointmentSubmissionState.retryable = false;

      resetDateTimeViewState();
      dateTimeViewState.notice = notice;

      bookingState.currentStep = 3;

      await loadAvailableDates();

      return;
    }
    console.error("Failed to create appointment:", error);

    appointmentSubmissionState.status = "error";
    appointmentSubmissionState.error =
      error.userMessage ?? "We couldn't create your appointment.";

    appointmentSubmissionState.errorCode = error.code ?? "UNKNOWN_ERROR";
    appointmentSubmissionState.retryable = Boolean(error.retryable);

    await renderApp();
  }
}

app.addEventListener("click", async (event) => {
  const serviceButton = event.target.closest('[data-action="select-service"]');

  if (serviceButton) {
    await selectService(serviceButton.dataset.serviceId);

    return;
  }

  const barberButton = event.target.closest('[data-action="select-barber"]');

  if (barberButton) {
    await selectBarber(barberButton.dataset.barberId);
  }
  const firstAvailableButton = event.target.closest(
    '[data-action="select-first-available"]',
  );

  if (firstAvailableButton) {
    await selectFirstAvailable();

    return;
  }

  const backButton = event.target.closest('[data-action="back-to-service"]');

  if (backButton) {
    await backToService();

    return;
  }

  const continueToDateTimeButton = event.target.closest(
    '[data-action="continue-to-date-time"]',
  );

  if (continueToDateTimeButton) {
    await continueToDateTime();

    return;
  }

  const dateButton = event.target.closest('[data-action="select-date"]');

  if (dateButton) {
    await selectDate(dateButton.dataset.date);

    return;
  }

  const timeButton = event.target.closest('[data-action="select-time"]');

  if (timeButton) {
    await selectTime(timeButton.dataset.time);

    return;
  }

  const backToBarberButton = event.target.closest(
    '[data-action="back-to-barber"]',
  );

  if (backToBarberButton) {
    await backToBarber();

    return;
  }

  const continueToDetailsButton = event.target.closest(
    '[data-action="continue-to-details"]',
  );

  if (continueToDetailsButton) {
    await continueToDetails();

    return;
  }

  const backToDateTimeButton = event.target.closest(
    '[data-action="back-to-date-time"]',
  );

  if (backToDateTimeButton) {
    await backToDateTime();

    return;
  }

  const backToDetailsButton = event.target.closest(
    '[data-action="back-to-details"]',
  );

  if (backToDetailsButton) {
    await backToDetails();

    return;
  }
  const confirmAppointmentButton = event.target.closest(
    '[data-action="confirm-appointment"]',
  );

  if (confirmAppointmentButton) {
    await confirmAppointment();

    return;
  }
});

app.addEventListener("input", (event) => {
  const field = event.target.closest(
    "#customer-details-form input, #customer-details-form textarea",
  );

  if (!field) {
    return;
  }

  const { name, value } = field;

  if (!(name in bookingState.customer)) {
    return;
  }

  bookingState.customer[name] = value;
});

app.addEventListener("submit", async (event) => {
  const form = event.target.closest("#customer-details-form");

  if (!form) {
    return;
  }

  event.preventDefault();

  const fields = form.querySelectorAll("input[required]");

  let isValid = true;
  let firstInvalidField = null;

  fields.forEach((field) => {
    const formField = field.closest(".form-field");

    const error = formField.querySelector(".form-field__error");

    formField.classList.remove("form-field--invalid");

    error.textContent = "";

    const isBlank = !field.value.trim();

    if (!field.validity.valid || isBlank) {
      isValid = false;
      firstInvalidField ??= field;

      formField.classList.add("form-field--invalid");

      if (field.validity.valueMissing || isBlank) {
        error.textContent = "This field is required.";
      } else if (field.validity.typeMismatch) {
        error.textContent = "Enter a valid value.";
      }
    }
  });

  if (!isValid) {
    firstInvalidField?.focus();

    return;
  }

  await confirmAppointment();
});

async function loadAvailableDates() {
  const requestId = ++datesRequestId;

  dateTimeViewState.datesStatus = "loading";

  dateTimeViewState.datesError = null;
  dateTimeViewState.availableDates = [];

  await renderApp();

  try {
    const availableDates = await bookingService.getAvailableDates({
      serviceId: bookingState.service.id,
      barberId: bookingState.barber?.id,
      preference: bookingState.barberPreference,
    });

    if (requestId !== datesRequestId) {
      return;
    }

    dateTimeViewState.availableDates = availableDates;

    dateTimeViewState.datesStatus = availableDates.length ? "success" : "empty";

    if (bookingState.date && !availableDates.includes(bookingState.date)) {
      bookingState.date = null;
      bookingState.time = null;

      dateTimeViewState.availableTimes = [];
      dateTimeViewState.timesStatus = "idle";
    }
  } catch (error) {
    if (requestId !== datesRequestId) {
      return;
    }

    console.error("Failed to load available dates:", error);

    dateTimeViewState.datesStatus = "error";

    dateTimeViewState.datesError =
      error.userMessage ?? "We couldn't load appointment dates.";
  }

  await renderApp();
}

async function loadAvailableTimes() {
  if (!bookingState.date) {
    dateTimeViewState.availableTimes = [];
    dateTimeViewState.timesStatus = "idle";

    return;
  }

  const requestId = ++timesRequestId;

  dateTimeViewState.timesStatus = "loading";

  dateTimeViewState.timesError = null;
  dateTimeViewState.availableTimes = [];

  await renderApp();

  try {
    const availableTimes = await bookingService.getAvailableTimes({
      serviceId: bookingState.service.id,

      barberId: bookingState.barber?.id,

      preference: bookingState.barberPreference,

      date: bookingState.date,
    });

    if (requestId !== timesRequestId) {
      return;
    }

    dateTimeViewState.availableTimes = availableTimes;

    dateTimeViewState.timesStatus = availableTimes.length ? "success" : "empty";
  } catch (error) {
    if (requestId !== timesRequestId) {
      return;
    }

    console.error("Failed to load available times:", error);

    dateTimeViewState.timesStatus = "error";

    dateTimeViewState.timesError =
      error.userMessage ?? "We couldn't load appointment times.";
  }

  await renderApp();
}

async function resetDateTimeViewState() {
  datesRequestId += 1;
  timesRequestId += 1;

  dateTimeViewState.availableDates = [];
  dateTimeViewState.datesStatus = "idle";
  dateTimeViewState.datesError = null;
  dateTimeViewState.notice = null;

  dateTimeViewState.availableTimes = [];
  dateTimeViewState.timesStatus = "idle";
  dateTimeViewState.timesError = null;
}

void renderApp();
