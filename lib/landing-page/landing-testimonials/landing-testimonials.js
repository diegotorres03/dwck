
import { DWCKComponent } from '../../dwck-component.js'
import { LandingTestimonialCard } from './landing-testimonial-card/landing-testimonial-card.js'

export class LandingTestimonialsComponent extends DWCKComponent {

  path = import.meta.url;
  template = "./landing-testimonials.html";
  styles = ["./landing-testimonials.css"];

  static get observedAttributes() {
    return ['data-title', 'data-subtitle'];
  }

  constructor() {
    super()
  }

  async connectedCallback() {
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

window.customElements.define(
  'landing-testimonials',
  LandingTestimonialsComponent,
);
