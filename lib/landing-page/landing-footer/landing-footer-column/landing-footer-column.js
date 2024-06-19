
import { DWCKComponent } from '../../../dwck-component.js'


export class LandingFooterColumn extends DWCKComponent {
  static get observedAttributes() {
    return ['data-title'];
  }


  path = import.meta.url;
  template = "./landing-footer-column.html";
  styles = ["./landing-footer-column.css"];

  constructor() {
    super()
  }

  async connectedCallback() {
    const { registerTriggers, onDomReady } = await import('../../../web-tools.js')
    await onDomReady()
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));

    const elements = Array.from(this.querySelectorAll('p'));
    // console.log(':D', elements);

    const listItems = elements.map((element) => {
      const li = document.createElement('li');
      li.appendChild(element);
      // console.log(element.textContent);

      return li;
    });

    listItems.forEach((element) => {
      this.appendChild(element);
    });
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-title' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#title').textContent = newValue;
    }
  }

  adoptedCallback() {}
}

window.customElements.define('landing-footer-column', LandingFooterColumn);
