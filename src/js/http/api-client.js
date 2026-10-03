import { BookingError, BOOKING_ERROR_CODES } from "../booking/booking-error.js";

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createHttpError(response, payload) {
  if (payload?.error?.code && payload?.error?.userMessage) {
    return new BookingError({
      code: payload.error.code,

      message: payload.error.message ?? payload.error.userMessage,

      userMessage: payload.error.userMessage,

      retryable: Boolean(payload.error.retryable),
    });
  }

  if (response.status === 401) {
    return new BookingError({
      code: BOOKING_ERROR_CODES.AUTH_ERROR,

      message: "Booking API authorization failed.",

      userMessage: "The booking service is temporarily unavailable.",

      retryable: false,
    });
  }

  if (response.status === 409) {
    return new BookingError({
      code: BOOKING_ERROR_CODES.SLOT_UNAVAILABLE,

      message: "The selected appointment slot is no longer available.",

      userMessage:
        "That appointment time is no longer available. Please choose another time.",

      retryable: false,
    });
  }

  if (response.status === 422) {
    return new BookingError({
      code: BOOKING_ERROR_CODES.INVALID_CUSTOMER,

      message: "The booking API rejected the customer information.",

      userMessage: "Please check your information and try again.",

      retryable: false,
    });
  }

  if (response.status === 400) {
    return new BookingError({
      code: BOOKING_ERROR_CODES.APPOINTMENT_REJECTED,

      message: "The booking API rejected the request.",

      userMessage: "We couldn't complete your request. Please try again.",

      retryable: false,
    });
  }

  if (response.status >= 500) {
    return new BookingError({
      code: BOOKING_ERROR_CODES.PROVIDER_UNAVAILABLE,

      message: `Booking API returned ${response.status}.`,

      userMessage:
        "The booking service is temporarily unavailable. Please try again.",

      retryable: true,
    });
  }

  return new BookingError({
    code: BOOKING_ERROR_CODES.UNKNOWN_ERROR,

    message: `Booking API returned ${response.status}.`,

    userMessage: "We couldn't complete your request. Please try again.",

    retryable: true,
  });
}

export async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,

      headers: {
        Accept: "application/json",

        ...(options.body
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...options.headers,
      },
    });
  } catch (error) {
    throw new BookingError({
      code: BOOKING_ERROR_CODES.NETWORK_ERROR,

      message: error?.message ?? "Network request failed.",

      userMessage: "We couldn't reach the booking service. Please try again.",

      retryable: true,

      cause: error,
    });
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw createHttpError(response, payload);
  }

  return payload;
}
