import "../css/styles.css";

import { services } from "./data/mock-data.js";
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
      const availableTimes = await bookingService.getAvailableTimes({
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

  const availableDates = await bookingService.getAvailableDates({
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

  await renderApp();
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

  await renderApp();
}

async function selectTime(time) {
  bookingState.time = time;

  if (bookingState.barberPreference === "first-available") {
    const availableBarbers = await bookingService.getAvailableBarbersForSlot({
      serviceId: bookingState.service.id,

      date: bookingState.date,

      time,
    });

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

void renderApp();
