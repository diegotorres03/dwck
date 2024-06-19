import { DWCKComponent } from "../../dwck-component.js"
import { LandingFeatureCard } from './landing-feature-card/landing-feature-card.js'

export class LandingFeaturesComponent extends DWCKComponent {
  static get observedAttributes() {
    return ['data-title', 'data-subtitle'];
  }


  path = import.meta.url;
  template = "./landing-features.html";
  styles = ["./landing-features.css"];

  constructor() {
    super()
  }

  connectedCallback() {
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
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
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#subtitle').textContent = newValue;
    }
  }

  adoptedCallback() { }
}

window.customElements.define('landing-features', LandingFeaturesComponent);
