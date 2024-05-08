import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
} from '../../../global/web-tools'

import DataQueryComponent from './data-query'


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

// [ ] use MutationObserver to detect DOM changes and update accordingly

const { list, get, del, clear, put } = DataQueryComponent.EVENT_TYPES
export default class DataSetComponent extends HTMLElement {
  get DEFAULT_EVENT_NAME() {
    return 'updated'
  }

  get #dataPoints() {
    return [...this.shadowRoot.querySelectorAll('data-point')]
    // return [...this.querySelectorAll('data-point')]
  }

  constructor() {
    super()
    const template = html`<slot></slot>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

  }

  #requestLoadFromDatastore() {
    console.log('#requestLoadFromDatastore()')
    this.dispatchEvent(new CustomEvent('sync', {
      bubbles: true, composed: true,
      detail: { key: this.id, page: 1, size: 20 },
    }))
  }

  async connectedCallback() {
    // mapComponentEvents(this)
    // updateVars(this)
    registerTriggers(this, (event) => this.addDataPoint(event))

    await sleep(20)
    this.#requestLoadFromDatastore()

    this.#registerQueries()

  }

  #registerQueries() {
    const dataQueries = Array.from(this.querySelectorAll('data-query'))
    dataQueries.forEach(query => {
      console.log('data-query', query)
      const eventName = query.getAttribute('type')
      query.addEventListener(eventName, event => {
        console.log('performing query', event)
        if (eventName === DataQueryComponent.EVENT_TYPES.put) {
          // this.setItem()
        } else if (eventName === DataQueryComponent.EVENT_TYPES.del) {
          const id = event.detail.id
          this.removeItem(id)
        } else if (eventName === DataQueryComponent.EVENT_TYPES.clear) {
          // const id = event.detail.id
          this.clear()
          // } else if() {
          // } else if() {

        }
        // here emit to data-store or whoever is the parent the query results so data-store can process the change'
        const newEvent = new CustomEvent(eventName, {
          bubbles: true, composed: true,
          detail: { ...event.detail },
        })

        // if(event.type === 'syncItem') return
        this.dispatchEvent(newEvent)
      })
    })
  }


  find(key) {
    this.#dataPoints
      .find(item => console.log('data-point', item))
  }

  clear() {
    console.log(this.querySelectorAll('data-point'))
    console.log(this.shadowRoot.querySelectorAll('data-point'))
    const items = Array.from(this.shadowRoot.querySelectorAll('data-point'))
    console.log('items to clear', items)
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
    console.log(item)
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

    console.log('removing item carajo', this.#dataPoints)
    const item = this.#dataPoints.find(item => item.id === id )

    if (!item) return console.warn('item not found', id)
    console.log(item)
    item.remove()
    this.dispatchEvent(new CustomEvent(del, {
      detail: { id }
    }))
    this.dispatchUpdatedEvent({ id, _action: 'del' })
    // this.dispatchUpdatedEvent
    // this.#requestLoadFromDatastore()

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
  addDataPoint(event) {
    console.log('adding point', event)

    if (!event.detail) return console.warn('event detail not present')

    const isBtn = event.target && event.target.tagName.toLowerCase() === 'button'
    let data = isBtn ? { ...event.target.dataset } : event.detail

    const dataAttributes = Object.keys(data)
      .map(key => `data-${key}="${data[key]}"`)
      .join(' ')

    console.log('dataAttributes', dataAttributes)

    const id = data.id || `${this.id}-${Date.now()}`
    const template = html`<data-point id="${id}" ${this.hasAttribute('visible') ? 'visible' : ''
      } ${dataAttributes} />`

    console.log('template', template)
    this.shadowRoot.prepend(template)
    // this.shadowRoot.appendChild(template)

    if (!data) return console.warn('no data')
    this.dispatchUpdatedEvent({ ...data, id, _action: 'add' })

  }


  dispatchUpdatedEvent(detail) {
    console.log('dispatchUpdatedEvent', detail)
    const newEvent = new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: true, composed: true,
      detail,
    })

    console.log(newEvent)

    // if (event.type === 'syncItem') return
    console.log('dispatching event', newEvent)
    this.dispatchEvent(newEvent)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }


}

window.customElements.define('data-set', DataSetComponent)
