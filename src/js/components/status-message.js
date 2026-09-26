import { renderIcon } from "./icon.js";

export function renderStatusMessage({ icon, title, message, loading = false }) {
  return `
    <div class="status-message">
      <span
        class="status-message__icon ${
          loading ? "status-message__icon--loading" : ""
        }"
        aria-hidden="true"
      >
        ${renderIcon(icon)}
      </span>

      <div>
        <strong class="status-message__title">
          ${title}
        </strong>

        ${
          message
            ? `
              <p class="status-message__text">
                ${message}
              </p>
            `
            : ""
        }
      </div>
    </div>
  `;
}
