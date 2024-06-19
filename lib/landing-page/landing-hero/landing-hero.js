
import { DWCKComponent } from '../../dwck-component.js'

export class LandingHeroComponent extends DWCKComponent {
  // Retornar atributos que serán observados (propensos a cambiar)
  static get observedAttributes() {
    return ['data-title', 'data-subtitle', 'data-image', 'data-background'];
  }

  path = import.meta.url;
  template = "./landing-hero.html";
  styles = ["./landing-hero.css"];



  constructor() {
    super()
  }

  connectedCallback() {
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-title' && newValue) {
      // Asignar el nuevo valor al html
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#title').textContent = newValue;
    } else if (name === 'data-subtitle' && newValue) {
      console.log(name, oldValue, newValue);
      this.shadowRoot.querySelector('#subtitle').textContent = newValue;
    } else if (name === 'data-img' && newValue) {
      console.log(name, oldValue, newValue);
      this.shadowRoot
        .querySelector('#hero-image')
        .setAttribute('src', newValue);
    } else if (name === 'data-background' && newValue) {
      console.log(name, oldValue, newValue);
      // El enlace de la imagen proviene del atributo 'data-background'.
      // Luego, se asigna este enlace al elemento 'this' como una variable CSS mediante la propiedad 'style'.
      // Es crucial utilizar la variable 'var(--hero-background-image)' en el elemento que exhibirá dicha imagen.

      this.style.setProperty('--hero-background-image', `url('${newValue}')`);
    }
  }

  adoptedCallback() {}
}

window.customElements.define('landing-hero', LandingHeroComponent);
