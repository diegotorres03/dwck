// import { mapComponentEvents, updateVars, registerTriggers, html } from "../../../global/web-tools.js";
import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'


export class FlipCardComponent extends DWCKComponent {

  static tag = 'flip-card'

  static get observedAttributes() {
    return ['scale']
  }

  set scale(value) {
    const styleComponent = this.shadowRoot.querySelector('style')
    styleComponent.style.setProperty('--scale', value)
    console.log(style, style.style)
  }

  get DEFAULT_EVENT_NAME() {
    return 'flipped'
  }

  path = import.meta.url
  styles = ['./flip-card.css']
  template = './flip-card.html'

  constructor() {
    super()

    this.addEventListener('componentReady', () => mapComponentEvents(this))

    // [ ] this is for the dissabled, find another way to do it
    // const disabled = this.hasAttribute('disabled')
    // const template = html`
    //   <style>
    //     ${FlipCardCss}
    //     ${disabled
    //     ? ''
    //     : `.flip-card-box:hover .flip-card {
    //     transform: rotateY(180deg) scale(var(--scale));
    //   }`}
    //   </style>
    //   ${FlipCardHtml}
    // `
  }

  connectedCallback() {
    onDomReady(() => registerTriggers(this, () => this.flip()))
  }

  flip() {
    console.log('flipping')
    const flipcard = this.shadowRoot.querySelector('.flip-card')
    // log(flipcard.classList)
    flipcard.classList.toggle('active')
    // log(flipcard.classList)
    this.dispatchEvent(
      new CustomEvent(this.DEFAULT_EVENT_NAME, {
        bubbles: true,
        composed: true,
      }),
    )
  }

  reset() {
    const flipcard = this.shadowRoot.querySelector('.flip-card')
    flipcard.classList.remove('active')
  }

}

window.customElements.define(FlipCardComponent.tag, FlipCardComponent)