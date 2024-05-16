import { DWCKComponent } from '../dwck-component.js'
// import {
//   html,
//   mapComponentEvents,
//   updateVars,
//   sleep,
//   registerTriggers,
//   onDomReady,
// } from '../../../global/web-tools'

export class MachineStateComponent extends DWCKComponent {

  static get observedAttributes() {
    return ['active']
  }

  set active(value) {
    this.#internalActivation(
      new CustomEvent('internal-activation', { bubbles: false, detail: { ...this.dataset } }))
  }
  get active() { return this.getAttribute('active') }

  get transitions() {
    return [...this.querySelectorAll('machine-transition')]
  }

  /**
   * @param {Array<HTMLElement>} 
   */
  #childListeners = []

  constructor() {
    super()
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
    const { registerTriggers } = await import('../web-tools.js')
    //  mapComponentEvents(this)
    //  updateVars(this)
    registerTriggers(this, (event) => this.#internalActivation(event))

    onDomReady(() => this.#init())



  }

  disconnectedCallback() { }

  adoptedCallback() { }

}

window.customElements.define('machine-state', MachineStateComponent)
