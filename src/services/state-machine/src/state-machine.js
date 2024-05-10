import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
  onDomReady,
} from '../../../global/web-tools'
import { MachineStateComponent } from './machine-state'

// import MachineStateComponent from './xstate/machine-state-xstate'

//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

/**
 * Web Component that represent a state machine
 * it helps control the flow of the application and ensure
 * only allowed transitions can happen given a state
 * 
 * @fires stateChanged this event is firea nd on every state transition
 * @fires [string:eventName] the name corresponds to the state name, is triggered when that state is activated 
 *
 * @export
 * @class StateMachineComponent
 * @extends {HTMLElement}
 */
export default class StateMachineComponent extends HTMLElement {

  get DEFAULT_EVENT_NAME() {
    return 'stateChanged'
  }


  get states() {
    return [...this.querySelectorAll('machine-state')]
  }

  /** @param {MachineStateComponent} */
  #currentState

  constructor() {
    super()
    const template = html`<slot></slot>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

    const triggers = [...this.shadowRoot.querySelectorAll('[trigger]')]

  }

  #init() {
    this.#currentState = this.querySelector('machine-state[active]')
    const initialState = this.querySelector(`machine-state#${this.getAttribute('initial')}`)
    if (!this.#currentState) this.#currentState = initialState

    this.addEventListener('activate-state', async event => {
      if (!this.#currentState) return console.warn('initialize the machine first')
      if (this.#currentState.id !== event.target.getAttribute('state')) return

      const targetSelector = event.target.getAttribute('target')
      const target = this.querySelector(`#${targetSelector}`)
      this.#activateState(target)
    })

  }

  connectedCallback() {
    onDomReady(() => this.#init())
    registerTriggers(this, event => {
      // validate event ?? 
      this.#activateState(this.#currentState)
    })

  }

  #deactivateAllStates() {
    this.states.forEach(state => {
      state.removeAttribute('active')

      const event = new CustomEvent('unactive', {
        bubbles: true, composed: true,
        detail: { tbd: true }
      })
      state.dispatchEvent(event)
    })
  }


  /**
   *
   *
   * @param {HTMLElement} state
   * @memberof StateMachineComponent
   */
  #activateState(state) {
    this.#deactivateAllStates()

    const event = new CustomEvent('active', {
      bubbles: true, composed: true,
      detail: { tbd: true }
    })
    state.dispatchEvent(event)

    const transitionEvent = new CustomEvent(state.id, {
      bubbles: true, composed: true,
      detail: { ...this.dataset, ...state.dataset }
    })

    this.dispatchEvent(transitionEvent)

    setTimeout(() => {
      state.setAttribute('active', '')
      this.#currentState = state
    }, 0)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('state-machine', StateMachineComponent)
