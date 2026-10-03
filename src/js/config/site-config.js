const bookingApiBaseUrl =
  import.meta.env?.VITE_BOOKING_API_BASE_URL?.trim() || "/api/booking";

export const siteConfig = {
  businessName: "The Barber Studio",

  contact: {
    phone: "(615) 555-1234",
    email: "hello@thebarberstudio.com",
  },

  location: {
    street: "123 Main Street",
    city: "Hendersonville",
    state: "TN",
    zipCode: "37075",
  },

  booking: {
    provider: "mock",
    timezone: "America/Chicago",
    apiBaseUrl: bookingApiBaseUrl,
  },
};
