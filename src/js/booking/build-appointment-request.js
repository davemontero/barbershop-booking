import { siteConfig } from "../config/site-config.js";

export function buildAppointmentRequest(bookingState) {
  const { service, barber, barberPreference, date, time, customer } =
    bookingState;

  if (!service || !barber || !date || !time) {
    throw new Error("Booking is missing required appointment information.");
  }

  return {
    serviceId: service.id,

    barberPreference,

    barberId: barber.id,

    date,
    time,

    timezone: siteConfig.booking.timezone,

    customer: {
      firstName: customer.firstName.trim(),

      lastName: customer.lastName.trim(),

      email: customer.email.trim(),

      phone: customer.phone.trim(),

      notes: customer.notes.trim(),
    },
  };
}
