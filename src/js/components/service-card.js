export function renderServiceCard(service, selectedServiceId = null) {
  const isSelected = service.id === selectedServiceId;

  return `
    <article
      class="service-card ${isSelected ? "service-card--selected" : ""}"
      data-service-id="${service.id}"
    >
      <div class="service-card__content">
        <h2 class="service-card__title">
          ${service.name}
        </h2>

        <p class="service-card__description">
          ${service.description}
        </p>

        <div class="service-card__meta">
          <span>${service.duration} min</span>
          <span class="service-card__separator" aria-hidden="true">•</span>
          <span>$${service.price}</span>
        </div>
      </div>

      <button
        class="button button--primary service-card__button"
        type="button"
        data-action="select-service"
        data-service-id="${service.id}"
      >
        ${isSelected ? "Selected" : "Select"}

        <span aria-hidden="true">
          ${isSelected ? "✓" : "→"}
        </span>
      </button>
    </article>
  `;
}
