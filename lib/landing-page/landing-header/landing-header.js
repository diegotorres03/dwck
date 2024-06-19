import { DWCKComponent } from '../../dwck-component.js'

export class LandingHeaderComponent extends DWCKComponent {
  // Retornar atributos que serán observados (propensos a cambiar)
  static get observedAttributes() {
    return ['data-title', 'data-subtitle', 'data-logo'];
  }


  path = import.meta.url;
  template = "./landing-header.html";
  styles = ["./landing-header.css"];

  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady } = await import('../../web-tools.js')
    await onDomReady()

    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));

    // const title = this.getAttribute('title');

    const elements = Array.from(this.querySelectorAll('a'));

    const listItems = elements.map((element) => {
      const li = document.createElement('li');
      li.classList.add('landing-header__nav-list-item');
      li.appendChild(element);

      return li;
    });

    listItems.forEach((element) => {
      this.appendChild(element);
    });

    const navMenu = this.shadowRoot.querySelector('#nav-list');
    const dropdownBtn = this.shadowRoot.querySelector('#dropdown-btn');

    dropdownBtn.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
    });
  }

  disconnectedCallback() { }

  // Solo los atributos que se retornan en 'observedAttributes' serán observados
  attributeChangedCallback(name, oldValue, newValue) {
    // Si el atributo es 'title' y existe un nuevo valor
    if (name === 'data-title' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#title').textContent = newValue;
    } else if (name === 'data-subtitle' && newValue) {
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#subtitle').textContent = newValue;
    } else if (name === 'data-logo' && newValue) {
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#logo').setAttribute('src', newValue);
    }
  }

  adoptedCallback() { }
}

window.customElements.define('landing-header', LandingHeaderComponent);
