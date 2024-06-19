import { DWCKComponent } from "../../../dwck-component.js";


export class LandingFeatureCard extends DWCKComponent {
  
  
  path = import.meta.url;
  template = "./landing-feature-card.html";
  styles = ["./landing-feature-card.css"];

  static get observedAttributes() {
    return ['title', 'subtitle'];
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

  constructor() {
    super()
  }


  async connectedCallback() {
    const { onDomReady, sleep, } = await import('../../../web-tools.js')
    await onDomReady()
    await sleep(400) // WHY?????
    this.updateVars()

  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

window.customElements.define('landing-feature-card', LandingFeatureCard);
