import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'



export class DataQueryComponent extends DWCKComponent {


  static EVENT_TYPES = {
    list: 'list',
    get: 'get',
    put: 'put',
    // update: 'update',
    delete: 'delete', // deprecate this, it can be destructured since delete is a reserved word
    del: 'delete', // alias to delete
    clear: 'clear',
  }


  get #parent() {
    return this.#findParent(this, 'data-store')
  }

  constructor() {
    super()
  }


  connectedCallback() {
    onDomReady(() => registerTriggers(this, (event) => this.#processRequest(event)))
  }

  async #processRequest(event) {
    const type = this.getAttribute('type')
    const key = this.getAttribute('key') || this.parentElement.id
    const size = this.getAttribute('size') || 100
    const page = this.getAttribute('page') || 1
    const order = this.getAttribute('order') || 'desc'

    const id = event.detail.id
    this.emit({ type, key, size, page, order, id, data: { ...event.detail } })
  }

  emit(data) {
    const queryType = data.type || 'list'
    console.info(`on ${this.id} emiting ${queryType}`)
    this.dispatchEvent(new CustomEvent(queryType, {
      // bubbles false, so only one event will reach the data store
      // this means this data query HAS TO BE an immediate child of data-set
      bubbles: false, composed: true,
      detail: data,
    }))
  }

  /**
 *
 *
 * @param {HTMLElement} element
 * @param {string} selector
 */
  #findParent(element, tagName) {
    const isHere = element.parentElement.tagName.toLowerCase() === tagName
    if (isHere) return element.parentElement
    return this.#findParent(element.parentElement, tagName)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('data-query', DataQueryComponent)


