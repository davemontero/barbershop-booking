import { siteConfig } from "../config/site-config.js";
import { assertBookingProvider } from "./provider-contract.js";
import { mockBookingProvider } from "../providers/mock/mock-booking-provider.js";
import { apiBookingProvider } from "../providers/api/api-booking-provider.js";

const providers = {
  mock: mockBookingProvider,
  api: apiBookingProvider,
};

export function getBookingProvider() {
  const providerName = siteConfig.booking.provider;

  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown booking provider: ${providerName}`);
  }

  return assertBookingProvider(provider, providerName);
}
