import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../../../global/web-tools'

import localforage from 'localforage'


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

export default class DataQueryComponent extends HTMLElement {


  static EVENT_TYPES = {
    list: 'list',
    get: 'get',
    put: 'put',
    update: 'update',
    delete: 'delete', // deprecate this, it can be destructured since delete is a reserved word
    del: 'delete', // alias to delete
    clear: 'clear',
  }


  get #parent() {
    return this.#findParent(this, 'data-store')
  }

  constructor() {
    super()
    const template = html``
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)
  }


  connectedCallback() {
    // mapComponentEvents(this)
    // updateVars(this)
    registerTriggers(this, (event) => this.#processRequest(event))
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

  // setItem(key, value) {
  //   return localforage.setItem(`${this.#parent.id}_${key}`, value)
  // }

  // getItem(key) {
  //   const dbKey = `${this.#parent.id}_${key}`
  //   return localforage.getItem(dbKey)
  // }

  // hasItem(key) {
  //   return !!this.getItem(`${this.#parent.id}_${key}`)
  // }

  // clearStore(key) {
  //   return localforage.removeItem(`${this.#parent.id}_${key}`)
  // }

  // async putItem(key, data) {
  //   const items = await this.getItem(key)
  //   const index = items.findIndex(item => item.__id === __id)
  //   if (index == - -1) return console.warn(`item with __id=${__id} was not found`)

  //   items[index] = data
  //   await this.setItem(key, items)
  // }


  // async deleteItem(key, __id) {
  //   const items = await this.getItem(key)
  //   const index = items.findIndex(item => item.__id === __id)
  //   if (index == - -1) return console.warn(`item with __id=${__id} was not found`)

  //   items.splice(index, 1)
  //   await this.setItem(key, items)
  // }


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


