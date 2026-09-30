import { services, barbers, availability } from "../../data/mock-data.js";
import {
  BookingError,
  BOOKING_ERROR_CODES,
} from "../../booking/booking-error.js";

function getCompatibleBarbers(serviceId) {
  return barbers.filter((barber) => barber.services.includes(serviceId));
}

function getEligibleBarbers({
  serviceId,
  barberId = null,
  preference = "specific",
}) {
  const compatibleBarbers = getCompatibleBarbers(serviceId);

  if (preference === "first-available") {
    return compatibleBarbers;
  }

  if (!barberId) {
    return [];
  }

  return compatibleBarbers.filter((barber) => barber.id === barberId);
}

function findAvailableBarber({ serviceId, date, time }) {
  return getCompatibleBarbers(serviceId).find((barber) => {
    const times = availability[barber.id]?.[date] ?? [];

    return times.includes(time);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockBookingProvider = {
  async getServices() {
    return services;
  },

  async getBarbersForService(serviceId) {
    if (serviceId === "haircut") {
      await delay(1500);
    }

    if (serviceId === "beard-trim") {
      await delay(200);
    }

    return getCompatibleBarbers(serviceId);
  },

  // async getBarbersForService(serviceId) {
  //   return getCompatibleBarbers(serviceId);
  // },

  async getAvailableDates({
    serviceId,
    barberId = null,
    preference = "specific",
  }) {
    const eligibleBarbers = getEligibleBarbers({
      serviceId,
      barberId,
      preference,
    });

    const dates = new Set();

    eligibleBarbers.forEach((barber) => {
      const barberAvailability = availability[barber.id] ?? {};

      Object.entries(barberAvailability).forEach(([date, times]) => {
        if (times.length > 0) {
          dates.add(date);
        }
      });
    });

    return [...dates].sort();
  },

  async getAvailableTimes({
    serviceId,
    barberId = null,
    preference = "specific",
    date,
  }) {
    if (!date) {
      return [];
    }

    const eligibleBarbers = getEligibleBarbers({
      serviceId,
      barberId,
      preference,
    });

    const times = new Set();

    eligibleBarbers.forEach((barber) => {
      const barberTimes = availability[barber.id]?.[date] ?? [];

      barberTimes.forEach((time) => {
        times.add(time);
      });
    });

    return [...times].sort();
  },

  async createAppointment(request) {
    let assignedBarber = null;

    if (request.staff.mode === "specific") {
      assignedBarber =
        barbers.find((barber) => barber.id === request.staff.barberId) ?? null;
    }

    if (request.staff.mode === "first-available") {
      assignedBarber = findAvailableBarber({
        serviceId: request.serviceId,

        date: request.start.date,

        time: request.start.time,
      });
    }

    if (!assignedBarber) {
      throw new BookingError({
        code: BOOKING_ERROR_CODES.SLOT_UNAVAILABLE,

        message: "No barber is available for the selected slot.",

        userMessage:
          "That appointment time is no longer available. Please choose another time.",

        retryable: false,
      });
    }

    const service = services.find(
      (service) => service.id === request.serviceId,
    );

    if (!service) {
      throw new BookingError({
        code: BOOKING_ERROR_CODES.APPOINTMENT_REJECTED,

        message: "Selected service does not exist.",

        userMessage: "The selected service is no longer available.",

        retryable: false,
      });
    }

    return {
      id: `mock-${crypto.randomUUID()}`,

      status: "confirmed",

      service,

      barber: assignedBarber,

      date: request.start.date,

      time: request.start.time,

      timezone: request.start.timezone,

      customer: request.customer,

      manageUrl: null,
    };
  },
};
