import { siteConfig } from "../config/site-config.js";

export function buildAppointmentRequest(bookingState) {
  const { service, barber, barberPreference, date, time, customer } =
    bookingState;

  if (!service || !date || !time) {
    throw new Error("Booking is missing required appointment information.");
  }

  if (barberPreference === "specific" && !barber) {
    throw new Error("A specific barber must be selected.");
  }

  return {
    serviceId: service.id,

    staff: {
      mode:
        barberPreference === "first-available" ? "first-available" : "specific",

      barberId: barberPreference === "specific" ? barber.id : null,
    },

    start: {
      date,
      time,

      timezone: siteConfig.booking.timezone,
    },

    customer: {
      firstName: customer.firstName.trim(),

      lastName: customer.lastName.trim(),

      email: customer.email.trim(),

      phone: customer.phone.trim(),

      notes: customer.notes.trim(),
    },
  };
}
