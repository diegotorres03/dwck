import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../../../global/web-tools'

import { createMachine, interpret } from 'xstate'
import MachineStateComponent from './machine-state-xstate'

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


  #instance

  #context = {}

  #state

  /**
   * get all the <machine-state> children 
   *
   * @memberof StateMachineComponent
   * @returns {MachineStateComponent}
   */
  get #childStates() {
    const childStates = [...this.querySelectorAll('machine-state')]
    return childStates || []
  }


  constructor() {
    super()
    const template = html`
      ${this.hasAttribute('visible') ? `<nav></nav>` : ''}
      <!-- <button id="open-modal-btn">open</button> -->
      <!-- <app-modal trigger="#open-modal-btn" on="click">
        <h1 slot="title">siii</h1>
      </app-modal> -->
    `
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

    const triggers = [...this.shadowRoot.querySelectorAll('[trigger]')]
    console.log('triggers', triggers)

    const machineDef = [...this.children]
    const initialStateId = this.getAttribute('initial')
    const initialState = this.querySelector(initialStateId)
    console.log('machineDef', machineDef)
    console.log('context', this.dataset)
    console.log('initial state', initialState)
    this.#context = this.dataset
    this.#state = initialState    

    

  }


  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('state-machine', StateMachineComponent)
