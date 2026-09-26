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

  const barberNote =
    bookingState.barberPreference === "first-available" && bookingState.barber
      ? "Assigned from First Available"
      : null;

  return `
    <aside class="appointment-summary">
      <header class="appointment-summary__header">
        <h2>
          Your Appointment
        </h2>
      </header>

      <div class="appointment-summary__body">
        <div class="appointment-summary__item">
          <span class="appointment-summary__icon">
            ${renderIcon("scissors")}
          </span>

          <div>
            <span class="appointment-summary__label">
              Service
            </span>

            <strong>
              ${bookingState.service?.name ?? "Not selected"}
            </strong>

            ${
              bookingState.service
                ? `
                  <small>
                    ${bookingState.service.duration} min
                    ·
                    $${bookingState.service.price}
                  </small>
                `
                : ""
            }
          </div>
        </div>

        <div class="appointment-summary__item">
          <span class="appointment-summary__icon">
            ${renderIcon("user")}
          </span>

          <div>
            <span class="appointment-summary__label">
              Barber
            </span>

            <strong>
              ${barberName}
            </strong>

            ${
              barberNote
                ? `
                  <small>
                    ${barberNote}
                  </small>
                `
                : ""
            }
          </div>
        </div>

        <div class="appointment-summary__item">
          <span class="appointment-summary__icon">
            ${renderIcon("calendar")}
          </span>

          <div>
            <span class="appointment-summary__label">
              Date
            </span>

            <strong>
              ${formatDate(bookingState.date)}
            </strong>
          </div>
        </div>

        <div class="appointment-summary__item">
          <span class="appointment-summary__icon">
            ${renderIcon("clock")}
          </span>

          <div>
            <span class="appointment-summary__label">
              Time
            </span>

            <strong>
              ${formatTime(bookingState.time)}
            </strong>
          </div>
        </div>
      </div>

      ${
        bookingState.service
          ? `
            <footer class="appointment-summary__footer">
              <span>Total</span>

              <strong>
                $${bookingState.service.price}
              </strong>
            </footer>
          `
          : ""
      }
    </aside>
  `;
}
