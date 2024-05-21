import {
  registerTriggers,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'


export class MachineStateComponent extends DWCKComponent {

  static tag = 'machine-state'

  static get observedAttributes() {
    return ['active']
  }

  set active(value) {
    console.log('activating state')
    if (value === null) return
    this.#internalActivation(new CustomEvent('internal-activation', { bubbles: false, detail: { ...this.dataset } }))
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

  }

  #init() {

    const otherElements = []
    Array.from(this.children)
      // .filter(el => el.localName !== 'state-transition')
      .filter(element => !element.hasAttribute('trigger'))
      .forEach(element => {
        console.log('element', element)
        if (element.localName === 'state-transition') {
          this.#childListeners.push(element)
        }
        element.setAttribute('trigger', `#${this.id}`)
        element.setAttribute('on', `active`)
      })


    console.log('dispatching event refresh-triggers')
    window.dispatchEvent(new CustomEvent('refresh-triggers', { bubbles: true, composed: true, detail: {} }))

    this.transitions.forEach(transition => {
      transition.setAttribute('state', this.id)
      // transition.addEventListener('activate-state', event => {
      // })
    })
  }

  #internalActivation(event) {
    console.log('internal activation')
    this.#childListeners.forEach(child => {
      child.activate(event)
    })
  }

  async connectedCallback() {
    console.info('machine-state connected')

    //  mapComponentEvents(this)
    //  updateVars(this)

    onDomReady(() => {
      this.#init()
      const unregisterTriggers = registerTriggers(this, (event) => this.#internalActivation(event))
    })

  }

  disconnectedCallback() { }



  adoptedCallback() { }

}

window.customElements.define(MachineStateComponent.tag, MachineStateComponent)
