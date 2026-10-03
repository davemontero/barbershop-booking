import { BookingError, BOOKING_ERROR_CODES } from "./booking-error.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function assertObject(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throwInvalidResponse(fieldName);
  }
}

function throwInvalidResponse(fieldName) {
  throw new BookingError({
    code: BOOKING_ERROR_CODES.UNKNOWN_ERROR,

    message: `Invalid appointment response: ${fieldName}`,

    userMessage:
      "We received an invalid response from the booking service. Please try again.",

    retryable: true,
  });
}

export function normalizeAppointment(appointment) {
  assertObject(appointment, "appointment");

  if (!isNonEmptyString(appointment.id)) {
    throwInvalidResponse("appointment.id");
  }

  if (!isNonEmptyString(appointment.status)) {
    throwInvalidResponse("appointment.status");
  }

  if (appointment.status !== "confirmed") {
    throwInvalidResponse("appointment.status");
  }

  assertObject(appointment.service, "appointment.service");

  assertObject(appointment.barber, "appointment.barber");

  assertObject(appointment.customer, "appointment.customer");

  if (
    !isNonEmptyString(appointment.service.id) ||
    !isNonEmptyString(appointment.service.name)
  ) {
    throwInvalidResponse("appointment.service");
  }

  if (
    !isNonEmptyString(appointment.barber.id) ||
    !isNonEmptyString(appointment.barber.name)
  ) {
    throwInvalidResponse("appointment.barber");
  }

  if (!isNonEmptyString(appointment.date)) {
    throwInvalidResponse("appointment.date");
  }

  if (!isNonEmptyString(appointment.time)) {
    throwInvalidResponse("appointment.time");
  }

  if (!isNonEmptyString(appointment.timezone)) {
    throwInvalidResponse("appointment.timezone");
  }

  return {
    id: appointment.id,

    status: appointment.status,

    service: appointment.service,

    barber: appointment.barber,

    date: appointment.date,

    time: appointment.time,

    timezone: appointment.timezone,

    customer: appointment.customer,

    manageUrl: appointment.manageUrl ?? null,
  };
}
