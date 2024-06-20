
import { DWCKComponent } from '../../../dwck-component.js'

export class LandingTestimonialCard extends DWCKComponent {


  static get observedAttributes() {
    return ['name', 'role', 'img'];
  }

  path = import.meta.url;
  template = "./landing-testimonial-card.html";
  styles = ["./landing-testimonial-card.css"];


  set name(value) {
    this.updateVars()
  }

  get name() {
    return this.getAttribute('name')
  }

  set role(value) {
    this.updateVars()
  }

  get role() {
    return this.getAttribute('role')
  }


  set img(value) {
    console.log('setting image', value)
    const img = this.shadowRoot.querySelector('#img')
    console.log('setting img',img)
    img?.setAttribute('src', value)
    if (!img) setTimeout(() => {
      const img = this.shadowRoot.querySelector('#img')
      console.log('setting img',img)
      img?.setAttribute('src', value)
    }, 500);
  }

  get img() {
    return this.getAttribute('img')
  }

  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, sleep } = await import('../../../web-tools.js')
    await onDomReady()
    await sleep(400)
    this.updateVars()
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() { }



  adoptedCallback() { }
}

window.customElements.define(
  'landing-testimonial-card',
  LandingTestimonialCard,
);
