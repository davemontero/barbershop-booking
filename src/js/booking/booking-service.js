import { getBookingProvider } from "./provider-factory.js";
import { normalizeBookingError } from "./booking-error.js";
import { normalizeAppointment } from "./appointment-contract.js";

const provider = getBookingProvider();

async function executeProviderCall(operation, options = {}) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeBookingError(error, options);
  }
}

export const bookingService = {
  async getServices() {
    return executeProviderCall(() => provider.getServices());
  },

  async getBarbersForService(serviceId) {
    return executeProviderCall(() => provider.getBarbersForService(serviceId));
  },

  async getAvailableDates(options) {
    return executeProviderCall(() => provider.getAvailableDates(options));
  },

  async getAvailableTimes(options) {
    return executeProviderCall(() => provider.getAvailableTimes(options));
  },

  async createAppointment(appointmentRequest) {
    const appointment = await executeProviderCall(
      () => provider.createAppointment(appointmentRequest),
      {
        fallbackUserMessage:
          "We couldn't create your appointment. Please try again.",
      },
    );

    return normalizeAppointment(appointment);
  },
};
