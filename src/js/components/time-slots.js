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

export function renderTimeSlots(times = [], selectedTime = null) {
  if (!times.length) {
    return `
      <section class="time-slots">
        <p class="time-slots__empty">
          Select an available date to view times.
        </p>
      </section>
    `;
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
                class="
                  time-slot
                  ${isSelected ? "time-slot--selected" : ""}
                "
                type="button"
                data-action="select-time"
                data-time="${time}"
              >
                ${formatTime(time)}
              </button>
            `;
        })
        .join("");

      return `
        <div class="time-slots__group">
          <h3>${period}</h3>

          <div class="time-slots__grid">
            ${buttons}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="time-slots">
      ${groups}
    </section>
  `;
}
