import { html } from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'

import { DataQueryComponent } from './data-query.js'
import { DataPointComponent } from './data-point.js'

// [ ] use MutationObserver to detect DOM changes and put accordingly

const { list, get, del, clear, put } = DataQueryComponent.EVENT_TYPES

export class DataSetComponent extends DWCKComponent {
  get DEFAULT_EVENT_NAME() {
    return 'updated'
  }

  get #dataPoints() {
    return [...this.shadowRoot.querySelectorAll('data-point')]
    // return [...this.querySelectorAll('data-point')]
  }

  constructor() {
    super()
  }

  #requestLoadFromDatastore() {
    this.dispatchEvent(
      new CustomEvent('sync', {
        bubbles: true,
        composed: true,
        detail: { id: this.id, page: 1, size: 20 }
      })
    )
  }

  #init() {
    setTimeout(() => {
      this.#requestLoadFromDatastore()
    }, 0)

    this.#registerQueries()
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    this.#init()
    registerTriggers(this, event => this.addDataPoint(event))
  }

  #registerQueries() {
    const dataQueries = Array.from(this.querySelectorAll('data-query'))
    dataQueries.forEach(query => {
      const eventName = query.getAttribute('type')
      query.addEventListener(eventName, event => {
        if (eventName === DataQueryComponent.EVENT_TYPES.put) {
          this.updateItem(event)
        } else if (eventName === DataQueryComponent.EVENT_TYPES.del) {
          const id = event.detail.id
          this.removeItem(id)
        } else if (eventName === DataQueryComponent.EVENT_TYPES.clear) {
          // const id = event.detail.id
          this.clear()
        }
        // here emit to data-store or whoever is the parent the query results so data-store can process the change'
        const newEvent = new CustomEvent(eventName, {
          bubbles: true,
          composed: true,
          detail: { ...event.detail }
        })

        // if(event.type === 'syncItem') return
        this.dispatchEvent(newEvent)
      })
    })
  }

  find(key) {
    this.#dataPoints.find(item => console.log('data-point', item))
  }

  clear() {
    const items = Array.from(this.shadowRoot.querySelectorAll('data-point'))
    items.forEach(dataPoint => dataPoint && dataPoint.remove())
  }

  /**
   * Save an object on IndexedDB under a given key (this key will be prefixed with the store name)
   * @param {string} key data store key to be used
   * @param {*} value value to be stored on this data store key
   * @returns {*}
   */
  setItem(key, value) {
    const item = this.#dataPoints.find(item => item.id === key)
    // return localforage.setItem(`${this.id}_${key}`, value)
  }

  /**
   * Get an item from IndexedDB by a given key (this key will be prefixed with the store name)
   * @param {string} key
   * @returns {*}
   */
  getItem(key) {
    return this.shadowRoot.querySelector('data-point')
  }

  hasItem(key) {
    return !!this.getItem(`${this.id}_${key}`)
  }

  /**
   * remove an item from IndexedDB by a given key (this key will be prefixed with the store name)
   * @param {string} id
   * @returns {*}
   */
  removeItem(id) {
    const item = this.#dataPoints.find(item => {
      return item.id === id
    })

    if (!item) return console.warn('item not found', id)
    item.remove()
    this.dispatchEvent(
      new CustomEvent(del, {
        detail: { id }
      })
    )
    this.dispatchUpdatedEvent({ id, _action: 'del' })
  }

  updateItem(event) {
    const { id, data } = event.detail
    console.log('updateItem', event)
    const item = this.#dataPoints.find(item => {
      return item?.id === id
    })
    if (!item) return console.warn('item not found', event)

    const itemData = { ...item.dataset, _action: 'put', ...data }
    // Object.keys(data).forEach(key => {
    //   // if(data[key] === undefined) return
    //   item[key] = data[key]
    // })

    // this.dispatchEvent(new CustomEvent(put, {
    //   detail: { itemData }
    // }))

    this.dispatchUpdatedEvent(itemData)
    // this.dispatchUpdatedEvent({ ...data, id, _action: 'put' })
  }

  /**
   * append a <data-point> tag, it will take values from event.detail
   * or dataset.
   *
   * if event.type is other than'syncItem', an `updated` event will be triggered with the latest
   * data-point created
   *
   * @emits updated
   * @param {*} event
   * @memberof DataSetComponent
   */
  async addDataPoint(event) {
    console.info('adding data point')
    if (!event.detail) return console.warn('event detail not present')

    const isBtn =
      event.target && event.target.tagName.toLowerCase() === 'button'
    let data = isBtn ? { ...event.target.dataset } : event.detail

    const dataAttributes = Object.keys(data)
      .map(key => `data-${key}="${data[key]}"`)
      .join(' ')

    const isVisible = this.hasAttribute('visible') ? 'visible' : ''
    let id = data.id || `${this.id}-${Date.now()}`

    // if append, create a __id with the original id and leave the id for the freaking auto increment
    if (this.getAttribute('type') === 'timeseries') {
      data.__id = data.__id ? data.__id : data.id
      id = data.timestamp
    }

    const template = html`<data-point
      id="${id}"
      ${isVisible}
      ${dataAttributes}
    />`

    this.shadowRoot.prepend(template)
    // this.shadowRoot.appendChild(template)

    if (!data) return console.warn('no data')

    // this.dispatch(this.DEFAULT_EVENT_NAME, { ...data, id, _action: 'add' })
    this.dispatchUpdatedEvent({ ...data, id, _action: 'add' })
  }

  dispatchUpdatedEvent(detail) {
    const newEvent = new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: true,
      composed: true,
      detail
    })

    //   // if (event.type === 'syncItem') return
    this.dispatchEvent(newEvent)
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}

  adoptedCallback() {}
}

window.customElements.define('data-set', DataSetComponent)
