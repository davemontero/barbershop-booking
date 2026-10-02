import { renderIcon } from "./icon.js";

export function renderFirstAvailableOption(isSelected = false) {
  return `
    <button
      class="
        first-available
        ${isSelected ? "first-available--selected" : ""}
      "
      type="button"
      data-action="select-first-available"
      aria-pressed="${isSelected}"
    >
      <span
        class="first-available__icon"
        aria-hidden="true"
      >
        ${renderIcon("users")}
      </span>

      <span
        class="first-available__content"
      >
        <strong>
          First Available
        </strong>

        <span>
          Book with the next available barber
        </span>
      </span>

      <span
        class="first-available__indicator"
        aria-hidden="true"
      >
        ${isSelected ? renderIcon("check") : renderIcon("chevron-right")}
      </span>
    </button>
  `;
}
