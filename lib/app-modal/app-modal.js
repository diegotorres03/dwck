import {
  initializeValues,
  onDomReady,
  registerTriggers,
} from '../web-tools.js'
import { DWCKComponent } from "../dwck-component.js";


/** 
 * @typedef AppModalSlots
 * @property {HTMLSlotElement} title - slot for title
 * @property {HTMLSlotElement} main - slot for main content
 * @memberof ModalComponent
 */


/**
 * Modal Component, create the UI required to have a modal
 * if internally there are data attributes, those will be passed on the
 * `accepted` and `declined` events will include this data attributes
 * in the detail section of the event
 * 
 * Uses the {@link AppModalSlots} slots
 * 
 * 
 * @fires ModalComponent#accepted
 * @fires ModalComponent#declined
 * @author Diego Torres <diegotorres@gmail.com>
 * @author Marco del Boccio <marco@gmail.com>
 * 
 *
 * @class ModalComponent
 * @extends {HTMLElement}
 * 
 * 
 * @example
 * <button id="open-modal-btn">this btn open the modal</button>
 * <app-modal trigger="#open-modal-btn" on="click">
 *  <h1 slot="title">this is the modal title</h1>
 *  <section slot="main">
 *     any html here
 *  </section>
 * </app-modal>
 * 
 * <script>
 *  document.querySelector('app-modal')
 *    .addEventListener('accepted', event => console.log(event.detail))
 * </script>
 */
class ModalComponent extends DWCKComponent {


  path = import.meta.url
  template = './app-modal.html'
  styles = ['./app-modal.css']

  static get observedAttributes() {
    return ['open', 'trigger', 'on']
  }

  set trigger(value) {
    // this.setAttribute('trigger', value)
    registerTriggers(this)
  }

  set open(value) {
    console.log('opening')
    let open = value !== null
    const checker = this.shadowRoot.querySelector('#checker')
    if(!checker) { // to queue actions if the ui hasn't finish rendeing
      setTimeout(() => {
        this.shadowRoot.querySelector('#checker').checked = open
      }, 100);
    } else {
      checker.checked = open
    }
    
  }


  /**
   * if present modal will open, if not modal will close
   * @type {boolean}
   * @memberof ModalComponent
   */
  get open() {
    return this.getAttribute('open')
  }

  get DEFAULT_EVENT_NAME() {
    return 'accepted'
  }



  /**
   * Creates an instance of ModalComponent.
   * @memberof ModalComponent
   * @constructor
   */
  constructor() {
    super()
    this.addEventListener('componentReady', () =>
      import('../web-tools.js').then(({ mapComponentEvents }) =>
        mapComponentEvents(this)))
  }

  async #init() {
    const { registerTriggers } = await import('../web-tools.js')

    let unregisterTriggers = registerTriggers(this, (event) => this.show(event))

    // [ ] this should be done inside the reggisterTriggers
    // or somewhere where all components have this functionallity 
    window.addEventListener('refresh-triggers', event => {
      console.log('refreshing triggers', unregisterTriggers)
      unregisterTriggers && unregisterTriggers()
      unregisterTriggers = registerTriggers(this, (event) => this.show(event))
    })
    // setTimeout(unregisterTriggers, 10_000) 

  }

  connectedCallback() {

    // updateVars(this);
    onDomReady(() => this.#init())

  }


  /**
   * this is the method called when the accept button is clicked on modal
   * @memberof ModalComponent
   */
  accept() {
    // [ ] read form values or data-key and send that as part of the event data
    const inputFields = [...this.querySelectorAll('[name]')]

    // [ ] add hability to use data-key and also get text content
    const inputData = { ...this.dataset }

    // const inputData = {}
    inputFields.forEach(field => {
      if (!field.name) return
      inputData[field.name] = field.value || field.textContent
    })


    /**
     * 
     * @event ModalComponent#accepted
     * @type {CustomEvent}
     */
    const newEvent = new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: true, composed: true,
      detail: { ...inputData, ...this.dataset }
    })

    console.log(newEvent)

    this.shadowRoot.dispatchEvent(newEvent)

    this.hide()
  }

  /**
  * this is the method called when the cancel button is clicked on modal
  * @memberof ModalComponent
  */
  cancel() {

    /**
     * 
     * @event ModalComponent#declined
     * @type {CustomEvent}
     */
    this.shadowRoot.dispatchEvent(new CustomEvent('declined', {
      bubbles: true, composed: true,
      detail: { ...this.dataset }
    }))
    this.hide()
  }

  /**
   * To open the modal from JS
   *
   * @memberof ModalComponent
   */
  show(event = {}) {
    console.log('on modal show', event)
    this.setAttribute('open', '')
    const data = { ...event.detail, ...event.target.dataset }
    console.log('modal data', data)
    if (!data) return
    Object.keys(data).forEach(key =>
      this.setAttribute(`data-${key}`, data[key]))

    Array.from(this.querySelectorAll('[slot]'))
      .forEach(slot =>
        initializeValues(slot, new CustomEvent('updata-modal-content', {
          bubbles: false, composed: false, detail: data,
        })))


    // replace content



  }

  /**
   * To close the modal from JS
   *
   * @memberof ModalComponent
   */
  hide() {
    this.removeAttribute('open')
  }

  /**
   * if modal is opened, it will close it and viceversa
   */
  toggle() {
    this.hasAttribute('open') ? this.hide() : this.show()
  }


}

export { ModalComponent }

customElements.define('app-modal', ModalComponent);


