import { DWCKComponent } from "../../dwck-component.js"
import { LandingFeatureCard } from './landing-feature-card/landing-feature-card.js'

export class LandingFeaturesComponent extends DWCKComponent {
  path = import.meta.url;
  template = "./landing-features.html";
  styles = ["./landing-features.css"];

  static get observedAttributes() {
    return ['title', 'subtitle']
  }

  set title(value) {
    console.log('setting title on feature component', value)
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
    const { onDomReady, sleep, } = await import('../../web-tools.js')
    await onDomReady()
    this.updateVars()
  }

  disconnectedCallback() { }

  adoptedCallback() { }
}

window.customElements.define('landing-features', LandingFeaturesComponent);
