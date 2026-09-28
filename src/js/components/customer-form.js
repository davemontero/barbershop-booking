import { escapeHtml } from "../utils/escape-html.js";

export function renderCustomerForm(customer) {
  return `
    <form
      id="customer-details-form"
      class="customer-form"
      novalidate
    >
      <div class="customer-form__grid">
        <div class="form-field">
          <label for="firstName">
            First Name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            autocomplete="given-name"
            value="${escapeHtml(customer.firstName)}"
            required
          >

          <span class="form-field__error"></span>
        </div>

        <div class="form-field">
          <label for="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            autocomplete="family-name"
            value="${escapeHtml(customer.lastName)}"
            required
          >

          <span class="form-field__error"></span>
        </div>

        <div class="form-field">
          <label for="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            value="${escapeHtml(customer.email)}"
            required
          >

          <span class="form-field__error"></span>
        </div>

        <div class="form-field">
          <label for="phone">
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            value="${escapeHtml(customer.phone)}"
            required
          >

          <span class="form-field__error"></span>
        </div>

        <div class="form-field form-field--full">
          <label for="notes">
            Notes
            <span>Optional</span>
          </label>

          <textarea
            id="notes"
            name="notes"
            rows="4"
            placeholder="Anything you'd like your barber to know?"
          >${escapeHtml(customer.notes)}</textarea>
        </div>
      </div>
    </form>
  `;
}
