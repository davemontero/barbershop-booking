const bookingApiBaseUrl =
  import.meta.env.VITE_BOOKING_API_BASE_URL?.trim() || "/api/booking";

export const siteConfig = {
  businessName: "The Barber Studio",

  websiteUrl: "#",

  booking: {
    provider: "mock",

    timezone: "America/Chicago",

    apiBaseUrl: bookingApiBaseUrl,
  },

  location: {
    street: "123 Main Street",
    city: "Nashville",
    state: "TN",
    zipCode: "37201",
  },
};
