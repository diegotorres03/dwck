import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'
import { MachineStateComponent } from './machine-state.js'
import { StateTransitionComponent } from './state-transition.js'

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
 * @extends {DWCKComponent}
 */
export class StateMachineComponent extends DWCKComponent {

  static tag = 'state-machine'

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

  }

  #init() {
    this.#currentState = this.querySelector('machine-state[active]')
    const initialState = this.querySelector(`machine-state#${this.getAttribute('initial')}`)
    if (!this.#currentState) this.#currentState = initialState

    this.addEventListener('activate-state', async event => {
      console.log('activate-state requested', event.target.parentElement, this.#currentState)

      if (!this.#currentState) return console.warn('initialize the machine first')
      if (this.#currentState.id !== event.target.parentElement.id) return console.warn('wrong state to activate')
      // if (this.#currentState.id !== event.target.getAttribute('state')) return console.warn('wrong state to activate')

      console.log('activating state', event.target.id)

      const targetSelector = event.target.getAttribute('target')
      const target = this.querySelector(`#${targetSelector}`)
      this.#activateState(target)
    })

  }

  connectedCallback() {
    console.info('state-machine connected')
    onDomReady(() => {
      this.#init()
      registerTriggers(this, event => {
        console.log(event, this.#currentState)
        // validate event ?? 
        this.#activateState(this.#currentState)
      })
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

    if (state.hasAttribute('final')) {
      this.dispatch('done', { ...this.dataset, ...state.dataset }, { bubbles: true })
      this.#currentState = undefined
    }

    setTimeout(() => {
      state.setAttribute('active', '')
      this.#currentState = state
    }, 0)
  }


}

window.customElements.define(StateMachineComponent.tag, StateMachineComponent)
