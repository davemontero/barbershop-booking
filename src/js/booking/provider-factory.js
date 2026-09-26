import { siteConfig } from "../config/site-config.js";

import { mockBookingProvider } from "../providers/mock/mock-booking-provider.js";

const providers = {
  mock: mockBookingProvider,
};

export function getBookingProvider() {
  const providerName = siteConfig.booking.provider;

  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown booking provider: ${providerName}`);
  }

  return provider;
}
