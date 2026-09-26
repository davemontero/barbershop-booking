import { services, barbers, availability } from "../../data/mock-data.js";

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

export const mockBookingProvider = {
  async getServices() {
    return services;
  },

  async getBarbersForService(serviceId) {
    return getCompatibleBarbers(serviceId);
  },

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

  async getAvailableBarbersForSlot({ serviceId, date, time }) {
    if (!date || !time) {
      return [];
    }

    return getCompatibleBarbers(serviceId).filter((barber) => {
      const barberTimes = availability[barber.id]?.[date] ?? [];

      return barberTimes.includes(time);
    });
  },

  async createAppointment(booking) {
    return {
      id: `mock-${crypto.randomUUID()}`,
      status: "confirmed",
      appointment: booking,
    };
  },
};
