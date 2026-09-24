import { siteConfig } from "../config/site-config.js";

export function renderHeader() {
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a
          class="site-header__brand"
          href="/"
          aria-label="${siteConfig.businessName} home"
        >
          <span class="site-header__brand-small">The</span>
          <span class="site-header__brand-main">Barber Studio</span>
        </a>

        <a class="site-header__back-link" href="/">
          <span aria-hidden="true">←</span>
          Back to Site
        </a>
      </div>
    </header>
  `;
}
