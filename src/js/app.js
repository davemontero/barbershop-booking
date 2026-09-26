import "../css/styles.css";

import { services } from "./data/mock-data.js";
import { bookingState } from "./state.js";

import { renderHeader } from "./components/header.js";
import { renderProgressStepper } from "./components/progress-stepper.js";
import { renderServicePage } from "./components/service-page.js";

import {
  getServices,
  getBarbersForService,
  getAvailableDates,
  getAvailableTimes,
  getAvailableBarbersForSlot,
} from "./services/booking-service.js";

import {
  initializeDatePicker,
  destroyDatePicker,
} from "./components/date-picker.js";

import { renderDateTimePage } from "./components/date-time-page.js";
import { renderBarberPage } from "./components/barber-page.js";

const app = document.querySelector("#app");

function renderApp() {
  destroyDatePicker();

  app.innerHTML = `
    ${renderHeader()}

    <main class="booking-main">
      <div class="container">
        ${renderProgressStepper(bookingState.currentStep)}

        ${renderCurrentStep()}
      </div>
    </main>
  `;

  initializeCurrentStep();
}

function selectService(serviceId) {
  const services = getServices();

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

  renderApp();
}

function initializeCurrentStep() {
  if (bookingState.currentStep !== 3) {
    return;
  }

  const availableDates = getAvailableDates({
    serviceId: bookingState.service.id,

    barberId: bookingState.barber?.id,

    preference: bookingState.barberPreference,
  });

  initializeDatePicker({
    element: document.querySelector("#booking-date-picker"),

    availableDates,

    selectedDate: bookingState.date,

    onChange: selectDate,
  });
}

function renderCurrentStep() {
  switch (bookingState.currentStep) {
    case 1: {
      const services = getServices();

      return renderServicePage(services, bookingState.service?.id);
    }

    case 2: {
      const barbers = getBarbersForService(bookingState.service.id);

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
      const availableTimes = getAvailableTimes({
        serviceId: bookingState.service.id,

        barberId: bookingState.barber?.id,

        preference: bookingState.barberPreference,

        date: bookingState.date,
      });

      return renderDateTimePage(availableTimes, bookingState);
    }

    default:
      return "";
  }
}

function selectBarber(barberId) {
  const barbers = getBarbersForService(bookingState.service.id);

  const selectedBarber = barbers.find((barber) => barber.id === barberId);

  if (!selectedBarber) {
    return;
  }

  bookingState.barber = selectedBarber;

  bookingState.barberPreference = "specific";

  bookingState.date = null;
  bookingState.time = null;

  renderApp();
}

function continueToDateTime() {
  const hasBarber =
    bookingState.barber || bookingState.barberPreference === "first-available";

  if (!hasBarber) {
    return;
  }

  bookingState.currentStep = 3;

  renderApp();
}

function selectFirstAvailable() {
  bookingState.barber = null;

  bookingState.barberPreference = "first-available";

  bookingState.date = null;
  bookingState.time = null;

  renderApp();
}

function selectDate(date) {
  bookingState.date = date;

  bookingState.time = null;

  if (bookingState.barberPreference === "first-available") {
    bookingState.barber = null;
  }

  renderApp();
}

function selectTime(time) {
  bookingState.time = time;

  if (bookingState.barberPreference === "first-available") {
    const availableBarbers = getAvailableBarbersForSlot({
      serviceId: bookingState.service.id,

      date: bookingState.date,

      time,
    });

    bookingState.barber = availableBarbers[0] ?? null;
  }

  renderApp();
}

function backToService() {
  bookingState.currentStep = 1;

  renderApp();
}

function backToBarber() {
  bookingState.currentStep = 2;

  renderApp();
}

app.addEventListener("click", (event) => {
  const serviceButton = event.target.closest('[data-action="select-service"]');

  if (serviceButton) {
    selectService(serviceButton.dataset.serviceId);

    return;
  }

  const barberButton = event.target.closest('[data-action="select-barber"]');

  if (barberButton) {
    selectBarber(barberButton.dataset.barberId);
  }
  const firstAvailableButton = event.target.closest(
    '[data-action="select-first-available"]',
  );

  if (firstAvailableButton) {
    selectFirstAvailable();

    return;
  }

  const backButton = event.target.closest('[data-action="back-to-service"]');

  if (backButton) {
    backToService();

    return;
  }

  const continueToDateTimeButton = event.target.closest(
    '[data-action="continue-to-date-time"]',
  );

  if (continueToDateTimeButton) {
    continueToDateTime();

    return;
  }

  const dateButton = event.target.closest('[data-action="select-date"]');

  if (dateButton) {
    selectDate(dateButton.dataset.date);

    return;
  }

  const timeButton = event.target.closest('[data-action="select-time"]');

  if (timeButton) {
    selectTime(timeButton.dataset.time);

    return;
  }

  const backToBarberButton = event.target.closest(
    '[data-action="back-to-barber"]',
  );

  if (backToBarberButton) {
    backToBarber();

    return;
  }
});

renderApp();
