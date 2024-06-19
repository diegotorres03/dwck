
import { DWCKComponent } from '../../dwck-component.js'

export class LandingHeroComponent extends DWCKComponent {
  path = import.meta.url;
  template = "./landing-hero.html";
  styles = ["./landing-hero.css"];

  // Retornar atributos que serán observados (propensos a cambiar)
  static get observedAttributes() {
    return ['title', 'subtitle', 'image', 'background'];
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


  set image(value) {
    this.shadowRoot.querySelector('#hero-image')?.setAttribute('src', value)
  }

  get image() {
    return this.getAttribute('image')
  }


  set background(value) {
      this.style.setProperty('--hero-background-image', `url('${value}')`);
  }

  get background() {
    return this.getAttribute('background')
  }



  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, sleep } = await import('../../web-tools.js')
    await onDomReady()
    await sleep(100)
    this.updateVars()
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() { }

  adoptedCallback() { }
}

window.customElements.define('landing-hero', LandingHeroComponent);
