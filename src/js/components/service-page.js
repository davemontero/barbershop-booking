import { renderServiceList } from "./service-list.js";

import { renderStatusMessage } from "./status-message.js";

export function renderServicePage(viewState) {
  const { services, status, error } = viewState;

  const content = renderServiceContent({
    services,
    status,
    error,
  });

  return `
    <section class="booking-content">
      <header class="booking-content__header">
        <h1 class="booking-content__title">
          Book Your Appointment
        </h1>

        <p class="booking-content__subtitle">
          Choose your service
        </p>
      </header>

      ${content}
    </section>
  `;
}

function renderServiceContent({ services, status, error }) {
  if (status === "idle" || status === "loading") {
    return renderStatusMessage({
      type: "loading",
      variant: "panel",
      title: "Loading services...",
      message: "Please wait while we check what's available.",
    });
  }

  if (status === "error") {
    return renderStatusMessage({
      type: "error",
      variant: "panel",
      title: "Unable to load services",
      message: error ?? "We couldn't load services.",
      action: {
        label: "Try Again",
        action: "retry-services",
      },
    });
  }

  if (status === "success" && services.length === 0) {
    return renderStatusMessage({
      type: "empty",
      variant: "panel",
      title: "No services available",
      message: "There are currently no bookable services.",
    });
  }

  return renderServiceList(services);
}
