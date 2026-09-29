export const BOOKING_ERROR_CODES = Object.freeze({
  NETWORK_ERROR: "NETWORK_ERROR",

  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",

  SLOT_UNAVAILABLE: "SLOT_UNAVAILABLE",

  INVALID_CUSTOMER: "INVALID_CUSTOMER",

  APPOINTMENT_REJECTED: "APPOINTMENT_REJECTED",

  AUTH_ERROR: "AUTH_ERROR",

  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class BookingError extends Error {
  constructor({ code, message, userMessage, retryable = false, cause = null }) {
    super(message);

    this.name = "BookingError";

    this.code = code;

    this.userMessage = userMessage ?? message;

    this.retryable = retryable;

    this.cause = cause;
  }
}

export function isBookingError(error) {
  return error instanceof BookingError;
}

export function normalizeBookingError(
  error,
  {
    fallbackMessage = "An unexpected booking error occurred.",

    fallbackUserMessage = "Something went wrong. Please try again.",
  } = {},
) {
  if (isBookingError(error)) {
    return error;
  }

  return new BookingError({
    code: BOOKING_ERROR_CODES.UNKNOWN_ERROR,

    message: error?.message ?? fallbackMessage,

    userMessage: fallbackUserMessage,

    retryable: true,

    cause: error,
  });
}
