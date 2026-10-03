import { siteConfig } from "../../config/site-config.js";

import { apiRequest } from "../../http/api-client.js";

function buildUrl(path, searchParams = {}) {
  const baseUrl = siteConfig.booking.apiBaseUrl.replace(/\/+$/, "");

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const url = new URL(`${baseUrl}${normalizedPath}`, window.location.origin);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

export const apiBookingProvider = {
  async getServices() {
    return apiRequest(buildUrl("/services"));
  },

  async getBarbersForService(serviceId) {
    return apiRequest(
      buildUrl("/barbers", {
        serviceId,
      }),
    );
  },

  async getAvailableDates(options) {
    return apiRequest(
      buildUrl("/availability/dates", {
        serviceId: options.serviceId,

        barberId: options.barberId,

        preference: options.preference,
      }),
    );
  },

  async getAvailableTimes(options) {
    return apiRequest(
      buildUrl("/availability/times", {
        serviceId: options.serviceId,

        barberId: options.barberId,

        preference: options.preference,

        date: options.date,
      }),
    );
  },

  async createAppointment(appointmentRequest) {
    return apiRequest(buildUrl("/appointments"), {
      method: "POST",

      body: JSON.stringify(appointmentRequest),
    });
  },
};
