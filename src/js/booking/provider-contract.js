const requiredProviderMethods = [
  "getServices",
  "getBarbersForService",
  "getAvailableDates",
  "getAvailableTimes",
  "createAppointment",
];

export function assertBookingProvider(provider, providerName = "unknown") {
  if (!provider) {
    throw new Error(`Booking provider "${providerName}" is not defined.`);
  }

  requiredProviderMethods.forEach((methodName) => {
    if (typeof provider[methodName] !== "function") {
      throw new Error(
        `Booking provider "${providerName}" must implement ${methodName}().`,
      );
    }
  });

  return provider;
}
