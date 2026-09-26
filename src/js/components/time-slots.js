import { renderStatusMessage } from "./status-message.js";

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getPeriod(time) {
  const hour = Number(time.split(":")[0]);

  if (hour < 12) {
    return "Morning";
  }

  if (hour < 16) {
    return "Afternoon";
  }

  return "Evening";
}

export function renderTimeSlots({
  times = [],
  selectedTime = null,
  status = "idle",
  errorMessage = null,
}) {
  if (status === "idle") {
    return renderStatusMessage({
      icon: "calendar",
      title: "Select a date",
      message: "Available appointment times will appear here.",
    });
  }

  if (status === "loading") {
    return renderStatusMessage({
      icon: "loader",
      title: "Checking availability",
      message: "Finding available appointment times...",
      loading: true,
    });
  }

  if (status === "error") {
    return renderStatusMessage({
      icon: "alert",
      title: "Unable to load times",
      message: errorMessage ?? "Please try another date or try again.",
    });
  }

  if (status === "empty") {
    return renderStatusMessage({
      icon: "clock",
      title: "No times available",
      message:
        "There are no appointments available on this date. Try another day.",
    });
  }

  const periods = ["Morning", "Afternoon", "Evening"];

  const groups = periods
    .map((period) => {
      const periodTimes = times.filter((time) => getPeriod(time) === period);

      if (!periodTimes.length) {
        return "";
      }

      const buttons = periodTimes
        .map((time) => {
          const isSelected = time === selectedTime;

          return `
              <button
                class="time-slot ${isSelected ? "time-slot--selected" : ""}"
                type="button"
                data-action="select-time"
                data-time="${time}"
                aria-pressed="${isSelected}"
              >
                ${formatTime(time)}
              </button>
            `;
        })
        .join("");

      return `
        <section class="time-slots__group">
          <h3 class="time-slots__period">
            ${period}
          </h3>

          <div class="time-slots__grid">
            ${buttons}
          </div>
        </section>
      `;
    })
    .join("");

  return `
    <div class="time-slots">
      ${groups}
    </div>
  `;
}
