import { services, barbers, availability } from "../data/mock-data.js";

export function getServices() {
  return services;
}

export function getBarbersForService(serviceId) {
  return barbers.filter((barber) => barber.services.includes(serviceId));
}

function getEligibleBarbers({
  serviceId,
  barberId = null,
  preference = "specific",
}) {
  const compatibleBarbers = getBarbersForService(serviceId);

  if (preference === "first-available") {
    return compatibleBarbers;
  }

  return compatibleBarbers.filter((barber) => barber.id === barberId);
}

export function getAvailableDates({
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
}

export function getAvailableTimes({
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
}

export function getAvailableBarbersForSlot({ serviceId, date, time }) {
  if (!date || !time) {
    return [];
  }

  return getBarbersForService(serviceId).filter((barber) => {
    const barberTimes = availability[barber.id]?.[date] ?? [];

    return barberTimes.includes(time);
  });
}
