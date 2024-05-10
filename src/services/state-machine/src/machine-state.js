import {
  html,
  mapComponentEvents,
  updateVars,
  sleep,
  registerTriggers,
  onDomReady,
} from '../../../global/web-tools'

export class MachineStateComponent extends HTMLElement {

  static get observedAttributes() {
    return ['active']
  }

  get transitions() {
    return [...this.querySelectorAll('machine-transition')]
  }

  /**
   * @param {Array<HTMLElement>} 
   */
  #childListeners = []

  constructor() {
    super()
    const template = html`<slot></slot>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

  }

  #init() {

    Array.from(this.children)
      // .filter(el => el.localName !== 'machine-transition')
      .filter(element => !element.hasAttribute('trigger'))
      .forEach(element => {
        if (element.localName === 'machine-transition') {
          // alert('listo el pollo, este es')
          this.#childListeners.push(element)
        }
        element.setAttribute('trigger', `#${this.id}`)
        element.setAttribute('on', `active`)
      })

    // window.dispatchEvent(new CustomEvent('refresh-triggers', { bubbles: true, composed: true, detail: {} }))

    this.transitions.forEach(transition => {
      transition.setAttribute('state', this.id)
      // transition.addEventListener('activate-state', event => {
      // })
    })
  }

  #internalActivation(event) {
    this.#childListeners.forEach(child => {
      child.activate(event)
    })
  }

  async connectedCallback() {
    //  mapComponentEvents(this)
    //  updateVars(this)
    const unregisterTriggers = registerTriggers(this, (event) => this.#internalActivation(event))

    onDomReady(() => this.#init())



  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active') {
      this.#internalActivation(new CustomEvent('internal-activation', { bubbles: false, detail: { ...this.dataset } }))
    }
  }

  adoptedCallback() { }

}

window.customElements.define('machine-state', MachineStateComponent)
