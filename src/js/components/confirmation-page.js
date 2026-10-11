import { siteConfig } from "../config/site-config.js";
import { getAppUrl } from "../utils/app-url.js";
import { renderIcon } from "./icon.js";

function formatDate(date) {
  if (!date) {
    return "";
  }

  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(time) {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";

  const formattedHour = hours % 12 || 12;

  return `${formattedHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function renderConfirmationPage(bookingState) {
  const appointment = bookingState.appointment;
  const confirmationImage = getAppUrl("images/confirmation/barber-chair.jpg");

  if (!appointment) {
    return "";
  }

  const { service, barber, date, time, customer } = appointment;

  return `
    <section class="confirmation-page">

      <div class="confirmation-page__main">
        <div class="confirmation-page__inner">

          <span
            class="confirmation-page__check"
            aria-hidden="true"
          >
            ${renderIcon("check")}
          </span>

          <h1 class="confirmation-page__title">
            You're All Set.
          </h1>

          <p class="confirmation-page__subtitle">
            Your appointment has been confirmed.
          </p>

          <div class="confirmation-card">

            <div class="confirmation-card__item">
              ${renderIcon("scissors")}

              <div>
                <span>Service</span>

                <strong>
                  ${service.name}
                </strong>

                <small>
                  $${service.price}
                  ·
                  ${service.duration} min
                </small>
              </div>
            </div>

            <div class="confirmation-card__item">
              ${renderIcon("calendar")}

              <div>
                <span>Date</span>

                <strong>
                  ${formatDate(date)}
                </strong>
              </div>
            </div>

            <div class="confirmation-card__item">
              ${renderIcon("user")}

              <div>
                <span>Barber</span>

                <strong>
                  ${barber.name}
                </strong>

                <small>
                  ${barber.role}
                </small>
              </div>
            </div>

            <div class="confirmation-card__item">
              ${renderIcon("clock")}

              <div>
                <span>Time</span>

                <strong>
                  ${formatTime(time)}
                </strong>
              </div>
            </div>

            <div class="confirmation-card__item confirmation-card__item--location">
              ${renderIcon("map-pin")}

              <div>
                <span>Location</span>

                <strong>
                  ${siteConfig.businessName}
                </strong>

                <small>
                  ${siteConfig.location.street}<br>
                  ${siteConfig.location.city},
                  ${siteConfig.location.state}
                  ${siteConfig.location.zipCode}
                </small>
              </div>
            </div>

          </div>

          <div class="confirmation-page__actions">

            <button
              class="button button--secondary"
              type="button"
              data-action="add-to-calendar"
            >
              ${renderIcon("calendar-plus")}
              Add to Calendar
            </button>

            <button
              class="button button--secondary"
              type="button"
              data-action="manage-appointment"
              disabled
            >
              ${renderIcon("external-link")}
              View / Manage Appointment
            </button>

            <a
              class="button button--primary"
              href="/"
            >
              ${renderIcon("home")}
              Back to Home
            </a>

          </div>

          <p class="confirmation-page__email-note">
            A confirmation will be sent to
            ${customer.email}
          </p>

          ${
            appointment?.id
              ? `
                <p class="confirmation-page__reference">
                  Confirmation:
                  ${appointment.id}
                </p>
              `
              : ""
          }

        </div>
      </div>

      <aside
        class="confirmation-page__visual"
        style="
          --confirmation-image:
            url('${confirmationImage}');
        "
        aria-hidden="true"
      >
        <div class="confirmation-page__visual-message">
          <strong>
            The Barber Studio
          </strong>

          <span class="confirmation-page__visual-line"></span>

          <span>
            Your next great cut starts here.
          </span>
        </div>

        <div class="confirmation-page__visual-footer">
          <strong>
            Thank You
          </strong>

          <span>
            For booking with
            ${siteConfig.businessName}
          </span>
        </div>
      </aside>

    </section>
  `;
}
