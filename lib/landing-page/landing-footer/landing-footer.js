import { DWCKComponent } from '../../dwck-component.js'
import { LandingFooterColumn } from './landing-footer-column/landing-footer-column.js'

export class LandingFooterComponent extends DWCKComponent {
  path = import.meta.url
  template = './landing-footer.html'
  styles = ['./landing-footer.css']

  constructor() {
    super()
  }
  connectedCallback() {
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}

  adoptedCallback() {}
}

window.customElements.define('landing-footer', LandingFooterComponent)
