import { getBookingProvider } from "./provider-factory.js";

const provider = getBookingProvider();

export const bookingService = {
  async getServices() {
    return provider.getServices();
  },

  async getBarbersForService(serviceId) {
    return provider.getBarbersForService(serviceId);
  },

  async getAvailableDates(options) {
    return provider.getAvailableDates(options);
  },

  async getAvailableTimes(options) {
    return provider.getAvailableTimes(options);
  },

  async getAvailableBarbersForSlot(options) {
    return provider.getAvailableBarbersForSlot(options);
  },

  async createAppointment(booking) {
    return provider.createAppointment(booking);
  },
};
