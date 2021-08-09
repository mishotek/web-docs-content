class AppHeader extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }

  render() {
    const style = document.createElement('style');
    // language=CSS
    style.innerText = `
        .header {
            display: flex;
            justify-content: center;
        }
        
        .header-content {
            width: var(--page-width);
            display: flex;
            align-items: center;
            height: 120px;
        }
    `;

    const header = document.createElement('div');
    header.classList.add('header');
    // language=HTML
    header.innerHTML = `
      <div class="header-content">
        <a href="/" aria-label="Devcast Web documentation">
          <img src="../assets/images/header-logo.svg" alt="Devcast logo">
        </a>
      </div>
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(header);
  }
}

customElements.define('app-header', AppHeader);
