import { renderBarberCard } from "./barber-card.js";

export function renderBarberList(barbers, selectedBarberId = null) {
  const barberCards = barbers
    .map((barber) => renderBarberCard(barber, selectedBarberId))
    .join("");

  return `
    <div class="barber-list">
      ${barberCards}
    </div>
  `;
}
