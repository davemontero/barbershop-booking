const steps = [
  {
    number: 1,
    label: "Service",
  },
  {
    number: 2,
    label: "Barber",
  },
  {
    number: 3,
    label: "Date & Time",
  },
  {
    number: 4,
    label: "Details",
  },
];

export function renderProgressStepper(currentStep = 1) {
  const stepsMarkup = steps
    .map((step) => {
      const isCompleted = step.number < currentStep;
      const isActive = step.number === currentStep;

      const classes = [
        "progress-stepper__step",
        isCompleted ? "progress-stepper__step--completed" : "",
        isActive ? "progress-stepper__step--active" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const indicator = isCompleted ? "✓" : step.number;

      return `
        <li class="${classes}">
          <div class="progress-stepper__indicator">
            ${indicator}
          </div>

          <span class="progress-stepper__label">
            ${step.label}
          </span>
        </li>
      `;
    })
    .join("");

  return `
    <nav
      class="progress-stepper"
      aria-label="Booking progress"
    >
      <ol class="progress-stepper__list">
        ${stepsMarkup}
      </ol>
    </nav>
  `;
}
