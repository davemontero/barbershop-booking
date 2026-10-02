import { renderIcon } from "./icon.js";

import { escapeHtml } from "../utils/escape-html.js";

const defaultIcons = {
  loading: "loader-2",
  error: "alert-circle",
  empty: "calendar",
  info: "alert-circle",
};

export function renderStatusMessage({
  icon,
  title,
  message,
  loading = false,
  type = "info",
  variant = "inline",
  action = null,
}) {
  const resolvedIcon = icon ?? defaultIcons[type] ?? defaultIcons.info;

  const isLoading = loading || type === "loading";

  const actionMarkup = action
    ? `
        <button
          class="button button--secondary"
          type="button"
          data-action="${escapeHtml(action.action)}"
        >
          ${escapeHtml(action.label)}
        </button>
      `
    : "";

  return `
    <div
      class="
        status-message
        status-message--${escapeHtml(type)}
        status-message--${escapeHtml(variant)}
      "
      ${type === "error" ? 'role="alert"' : 'role="status"'}
    >
      <span
        class="
          status-message__icon
          ${isLoading ? "status-message__icon--loading" : ""}
        "
        aria-hidden="true"
      >
        ${renderIcon(resolvedIcon)}
      </span>

      <div class="status-message__content">
        <strong
          class="status-message__title"
        >
          ${escapeHtml(title)}
        </strong>

        ${
          message
            ? `
              <p
                class="status-message__text"
              >
                ${escapeHtml(message)}
              </p>
            `
            : ""
        }

        ${actionMarkup}
      </div>
    </div>
  `;
}
