import { renderIcon } from "./icon.js";

function formatDate(date) {
  if (!date) {
    return "Not selected";
  }

  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(time) {
  if (!time) {
    return "Not selected";
  }

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function renderAppointmentSummary(bookingState) {
  const barberName =
    bookingState.barber?.name ??
    (bookingState.barberPreference === "first-available"
      ? "First Available"
      : "Not selected");

  return `
    <aside class="appointment-summary">
      <h2 class="appointment-summary__title">
        Your Appointment
      </h2>

      <div class="appointment-summary__item">
        ${renderIcon("user")}

        <div>
          <span>Service</span>

          <strong>
            ${bookingState.service?.name}
          </strong>

          <small>
            $${bookingState.service?.price}
          </small>
        </div>
      </div>

      <div class="appointment-summary__item">
        ${renderIcon("user")}

        <div>
          <span>Barber</span>

          <strong>
            ${barberName}
          </strong>
        </div>
      </div>

      <div class="appointment-summary__item">
        ${renderIcon("calendar")}

        <div>
          <span>Date</span>

          <strong>
            ${formatDate(bookingState.date)}
          </strong>
        </div>
      </div>

      <div class="appointment-summary__item">
        ${renderIcon("clock")}

        <div>
          <span>Time</span>

          <strong>
            ${formatTime(bookingState.time)}
          </strong>
        </div>
      </div>
    </aside>
  `;
}
