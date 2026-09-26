import "../css/styles.css";

import { bookingState } from "./state.js";

import { renderHeader } from "./components/header.js";
import { renderProgressStepper } from "./components/progress-stepper.js";
import { renderServicePage } from "./components/service-page.js";

import { bookingService } from "./booking/booking-service.js";

import {
  initializeDatePicker,
  destroyDatePicker,
} from "./components/date-picker.js";

import { renderDateTimePage } from "./components/date-time-page.js";
import { renderBarberPage } from "./components/barber-page.js";

const app = document.querySelector("#app");

const dateTimeViewState = {
  availableDates: [],
  datesStatus: "idle",
  datesError: null,

  availableTimes: [],
  timesStatus: "idle",
  timesError: null,
};

let datesRequestId = 0;
let timesRequestId = 0;

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

    default:
      return "";
  }
}

async function renderApp() {
  destroyDatePicker();

  const currentStepMarkup = await renderCurrentStep();

  app.innerHTML = `
    ${renderHeader()}

    <main class="booking-main">
      <div class="container">
        ${renderProgressStepper(bookingState.currentStep)}

        ${currentStepMarkup}
      </div>
    </main>
  `;

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

async function selectService(serviceId) {
  const services = await bookingService.getServices();

  const selectedService = services.find((service) => service.id === serviceId);

  if (!selectedService) {
    return;
  }

  bookingState.service = selectedService;

  bookingState.barber = null;
  bookingState.barberPreference = null;
  bookingState.date = null;
  bookingState.time = null;

  bookingState.currentStep = 2;

  await renderApp();
}

async function selectBarber(barberId) {
  const barbers = await bookingService.getBarbersForService(
    bookingState.service.id,
  );

  const selectedBarber = barbers.find((barber) => barber.id === barberId);

  if (!selectedBarber) {
    return;
  }

  bookingState.barber = selectedBarber;

  bookingState.barberPreference = "specific";

  bookingState.date = null;
  bookingState.time = null;

  await renderApp();
}

async function selectFirstAvailable() {
  bookingState.barber = null;

  bookingState.barberPreference = "first-available";

  bookingState.date = null;
  bookingState.time = null;

  await renderApp();
}

async function backToService() {
  bookingState.currentStep = 1;

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

async function backToBarber() {
  bookingState.currentStep = 2;

  await renderApp();
}

async function selectDate(date) {
  bookingState.date = date;
  bookingState.time = null;

  if (bookingState.barberPreference === "first-available") {
    bookingState.barber = null;
  }

  await loadAvailableTimes();
}

async function selectTime(time) {
  const serviceId = bookingState.service.id;
  const date = bookingState.date;

  bookingState.time = time;

  if (bookingState.barberPreference === "first-available") {
    const availableBarbers = await bookingService.getAvailableBarbersForSlot({
      serviceId,

      date,

      time,
    });

    const selectionIsCurrent =
      bookingState.service?.id === serviceId &&
      bookingState.date === date &&
      bookingState.time === time &&
      bookingState.barberPreference === "first-available";

    if (!selectionIsCurrent) {
      return;
    }

    bookingState.barber = availableBarbers[0] ?? null;
  }

  await renderApp();
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
      "We couldn't load appointment dates. Please try again.";
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
      "We couldn't load appointment times. Please try another date.";
  }

  await renderApp();
}

function resetDateTimeViewState() {
  datesRequestId += 1;
  timesRequestId += 1;

  dateTimeViewState.availableDates = [];
  dateTimeViewState.datesStatus = "idle";
  dateTimeViewState.datesError = null;

  dateTimeViewState.availableTimes = [];
  dateTimeViewState.timesStatus = "idle";
  dateTimeViewState.timesError = null;
}

void renderApp();
