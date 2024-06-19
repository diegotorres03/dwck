import { DWCKComponent } from "../../../dwck-component.js";


export class LandingFeatureCard extends DWCKComponent {
  static get observedAttributes() {
    return ['data-title', 'data-subtitle'];
  }

  
  path = import.meta.url;
  template = "./landing-feature-card.html";
  styles = ["./landing-feature-card.css"];

  constructor() {
    super()
  }

  connectedCallback() {
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() {}

  // Solo los atributos que se retornan en 'observedAttributes' serán observados
  attributeChangedCallback(name, oldValue, newValue) {
    // Si el atributo es 'title' y existe un nuevo valor
    if (name === 'data-title' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#title').textContent = newValue;
    } else if (name === 'data-subtitle' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#subtitle').textContent = newValue;
    }
  }

  adoptedCallback() {}
}

window.customElements.define('landing-feature-card', LandingFeatureCard);
