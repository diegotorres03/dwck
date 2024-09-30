import { DWCKComponent } from '../dwck-component.js'
console.log(DWCKComponent)
import { LandingCta } from './landing-cta/landing-cta.js'
import { LandingFeaturesComponent } from './landing-features/landing-features.js'
import { LandingFooterComponent } from './landing-footer/landing-footer.js'
import { LandingHeaderComponent } from './landing-header/landing-header.js'
import { LandingHeroComponent } from './landing-hero/landing-hero.js'
import { LandingTestimonialsComponent } from './landing-testimonials/landing-testimonials.js'

export class LandingPageComponent extends DWCKComponent {
  path = import.meta.url
  template = './landing-page.html'
  styles = ['./landing-page.css']

  constructor() {
    super()
  }

  async connectedCallback() {
    const { registerTriggers, onDomReady } = await import('../web-tools.js')
    await onDomReady()
    registerTriggers(this, event => console.log(event))
    console.log(this)
  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

window.customElements.define('landing-page', LandingPageComponent)
