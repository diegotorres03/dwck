import { DWCKComponent } from "../../dwck-component.js"

export class LandingCta extends DWCKComponent {
  static get observedAttributes() {
    return [
      'title',
      'subtitle',
      'cta',
      'background',
    ];
  }


  set title(value) {
    this.updateVars()
  }

  get title() {
    return this.getAttribute('title')
  }

  set subtitle(value) {
    this.updateVars()
  }

  get subtitle() {
    return this.getAttribute('subtitle')
  }

  set cta(value) {
    this.updateVars()
  }

  get cta() {
    return this.getAttribute('cta')
  }

  set background(value) {
      this.style.setProperty('--cta-background-image', `url('${value}')`)
  }

  get background() {
    return this.getAttribute('background')
  }

  path = import.meta.url;
  template = "./landing-cta.html";
  styles = ["./landing-cta.css"];

  constructor() {
    super()
  }


  async connectedCallback() {
    const { onDomReady, sleep, } = await import('../../web-tools.js')
    await onDomReady()
    await sleep(1000) // WHY?????
    this.updateVars()
  }

  disconnectedCallback() { }

  // Solo los atributos que se retornan en 'observedAttributes' serán observados
  // attributeChangedCallback(name, oldValue, newValue) {
  //   // Si el atributo es 'title' y existe un nuevo valor
  //   if (name === 'data-title' && newValue) {
  //     // Asignar el nuevo valor al html
  //     console.log(name, oldValue, newValue);
  //     this.shadowRoot.querySelector('#title').textContent = newValue;
  //   } else if (name === 'data-subtitle' && newValue) {
  //     // Asignar el nuevo valor al html
  //     console.log(name, oldValue, newValue);
  //     this.shadowRoot.querySelector('#subtitle').textContent = newValue;
  //   } else if (name === 'data-btn-content' && newValue) {
  //     console.log(name, oldValue, newValue);
  //     this.shadowRoot.querySelector('#cta-btn').textContent = newValue;
  //   } else if (name === 'data-background' && newValue) {
  //     console.log(name, oldValue, newValue);
  //     // El enlace de la imagen proviene del atributo 'data-background'.
  //     // Luego, se asigna este enlace al elemento 'this' como una variable CSS mediante la propiedad 'style'.
  //     // Es crucial utilizar la variable 'var(--hero-background-image)' en el elemento que exhibirá dicha imagen.

  //     this.style.setProperty('--cta-background-image', `url('${newValue}')`);
  //   }
  // }
  adoptedCallback() { }
}

window.customElements.define('landing-cta', LandingCta);
