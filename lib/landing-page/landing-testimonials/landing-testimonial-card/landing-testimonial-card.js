// import {
//   html,
//   mapComponentEvents,
//   updateVars,
//   registerTriggers,
// } from '../../../../../global/web-tools';

// import componentHtml from './landing-testimonial-card.html';
// import componentStyle from './landing-testimonial-card.css';
import { DWCKComponent } from '../../../dwck-component.js'

export class LandingTestimonialCard extends DWCKComponent {


  static get observedAttributes() {
    return ['data-content', 'data-name', 'data-position', 'data-img'];
  }

  path = import.meta.url;
  template = "./landing-testimonial-card.html";
  styles = ["./landing-testimonial-card.css"];



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
    // Si el atributo es 'name' y existe un nuevo valor
    if (name === 'data-name' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#name').textContent = newValue;
    } else if (name === 'data-content' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#content').textContent = newValue;
    } else if (name === 'data-position' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#position').textContent = newValue;
    } else if (name === 'data-img' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#img').setAttribute('src', newValue);
    }
  }

  adoptedCallback() {}
}

window.customElements.define(
  'landing-testimonial-card',
  LandingTestimonialCard,
);
