import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'
import { DataSetComponent } from './data-set.js'
import { DataQueryComponent } from './data-query.js'

const Dexie = window.Dexie

// import { updateItem, getItem, removeItem } from 'localforage'
// import { Dexie } from 'dexie'
// import { Dexie } from '../../node_modules/dexie/dist/dexie.js'

// import localforage from 'localforage'
// import DataSetComponent from './data-set'
// import DataQueryComponent from './data-query'


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

/**
 * This component help to interact with IndexedDB, 
 * allowing you to persis information on the browser
 * 
 * @example
 * <data-store id="usersDatabase" version="1">
 *   <data-set id="userProfile" visible trigger="#new-item-btn" on="click">
 *     <data-index key="id" autoincrement unique></data-index>
 *     <data-index key="name"></data-index>
 *     <data-index key="age"></data-index>
 *   </data-set>
 * 
 *   <data-set id="userPreferences">
 *     <data-index key="userId"></data-index>
 *   </data-set>
 * </data-store>
 * 
 * 
 * 
 * @export
 * @class DataStore
 * @author Diego Torres
 * @extends {HTMLElement}
 */
export default class DataStore extends DWCKComponent {

  // [ ] emit events to enable Change Data Capture

  // get action() { return this.getAttribute('action') }


  #dataSets

  /** @property {Dexie} db - db instance reference */
  #db

  get dataSets() {
    const datasets = [...this.querySelectorAll('data-set')]
    return datasets
  }


  constructor() {
    super()
    // const template = html`<slot></slot>`
    // updateItem('test', { test: true, success: true })

    this.addEventListener('componentReady', () => {
      const dbName = this.id || 'default'
      this.#db = new Dexie(dbName)
      this.#dataSets = Array.from(this.querySelectorAll('data-set'))
      console.log(this.#db)
    })
  }


  #dbInit() {
    // const version = Number(this.getAttribute('version')) || 1
    // const dbName = this.id || 'default'
    // const db = new Dexie(dbName)
    // db.
    const stores = {}
    const version = Number(this.getAttribute('version')) || 1

    Array.from(this.querySelectorAll('data-set')).forEach(dataset => {
      const indexes = [...dataset.querySelectorAll('data-index')]
      const indexDefinitions = indexes.map(index =>
        `${index.hasAttribute('autoincrement') ? '++' : ''}${index.getAttribute('key')}`)
      stores[dataset.id] = indexDefinitions.length > 0 ?
        indexDefinitions.join(', ') :
        'id'
    })

    const versionDeployment = this.#db.version(version).stores(stores)

    // this.#db.tables.forEach(table => {
    //   console.log('table', table)
    // })
  }


  #init() {

    console.info('data-store internal init')
    const version = Number(this.getAttribute('version'))
    this.#dbInit()

    const listenToSync = async event => {
      const key = event.detail.id
      // const items = await this.getItem(key)
      const items = await this.listItems(key, event.detail)
      const dataSet = this.querySelector(`#${event.detail.id}`)

      const getEvent = (item) => new CustomEvent('syncItem', { detail: item })


      if (Array.isArray(items)) {
        items.forEach(item => {
          const newEvent = getEvent(item)
          dataSet.addDataPoint(newEvent)
        })
      } else {
        dataSet.addDataPoint(getEvent(items))
      }

    }


    // Array.from(this.querySelector('data-set'))
    //   .forEach(set => set.addEventListener('sync', listenToSync))

    // Here i'm registering to the sync event, this is originated by the data-set when is initially loaded
    // the idea being, that if a dataset is inside a data store, the data store is the responsable to access indeedDB
    // so it when the sync event is detected, data store will load the items and communicat this back to the data-set

    this.addEventListener('sync', listenToSync)

    // this.#dataSets = Array.from(this.querySelectorAll('data-set'))

    this.#dataSets.forEach(dataSet => {
      const { list, get, del, clear, put } = DataQueryComponent.EVENT_TYPES
      dataSet.addEventListener(put, event => this.#processCrudEvent(event, put))
      dataSet.addEventListener(list, event => this.#processCrudEvent(event, list))
      dataSet.addEventListener(get, event => this.#processCrudEvent(event, get))
      dataSet.addEventListener(del, event => this.#processCrudEvent(event, del))
      dataSet.addEventListener(clear, event => this.#processCrudEvent(event, clear))
      dataSet.setAttribute('store', this.id)
    })

    this.addEventListener('updated', event => this.#processEvent(event))

  }



  async connectedCallback() {
    // mapComponentEvents(this)
    // updateVars(this)
    onDomReady(() => {
      this.#init()
      registerTriggers(this, (event) => this.#processEvent(event))
    })

  }

  async #processEvent(event) {
    const isBtn = event.target.tagName.toLowerCase() === 'button'
    let data = isBtn ? { ...event.target.dataset } : event.detail
    const tableName = event.target.id



    // const userData = {
    //   id: data.id,
    //   name: data.name,
    //   age: data.age,
    // }

    const table = this.#db.table(tableName)

    if (this.hasAttribute('append') || event.target.hasAttribute('append')) {
      const res = await table.where('id').between(1, 10).toArray()
      data.id = res.length + 1

      return table.add(data)
    }

    if (!data.id) data.id = data.name
    return table.put(data, data.__id || data.id)

  }

  async #processCrudEvent(event, queryType) {
    const { list, get, del, clear, put, update } = DataQueryComponent.EVENT_TYPES
    const table = event.target.id
    if (queryType === list) {
      const listRes = await this.listItems(table, event.detail)
      // and now I don't know what is the next step xD
    } else if (queryType === clear) {
      await this.clear(table)
    } else if (queryType === del) {
      const id = event.detail.id
      // event.target.removeItem(id)
      this.removeItem(table, id)
        .then(res => console.log('deleted', res))
        .catch(err => console.error(err))
    } else if (queryType === update) {
      console.log('on data-set', event)
      const id = event.detail.id
      // this.#db.table(table).where('id').equals(id)
    }

  }

  /**
   * Save an object on IndexedDB under a given key (this key will be prefixed with the store name)
   * @param {table} id data store key to be used
   * @param {string} id data store key to be used
   * @param {*} data value to be stored on this data store key
   * @returns {*} 
   */
  async updateItem(table, id, data) {
    const existingItem = await this.getItem(table, id)
    console.log('existingItem', existingItem)

  }

  listItems(table, query) {
    console.info('listing items', table)
    /*
    key: "tasks"
    order: "desc"
    page: 1
    size: 100
    type: "list"
    */
    // const res = 
    return this.#db.table(table)
      .limit(query.size || 10)//.offset(1)
      .toArray()


  }

  /**
   * Get an item from IndexedDB by a given key (this key will be prefixed with the store name)
   * @param {string} id 
   * @returns {*}
   */
  getItem(table, id) {
    return this.#db.table(table).get({ id })
  }

  hasItem(id) {
    // return !!this.getItem(`${this.id}_${id}`)
  }

  /**
   * remove an item from IndexedDB by a given key (this key will be prefixed with the store name)
   * @param {string} key 
   * @returns {*}
   */
  removeItem(table, id) {
    // return localforage.removeItem(`${this.id}_${key}`)
    return this.#db.table(table).where('id').equals(id).delete()
  }

  clear(tableName) {
    console.info('clearing table', tableName)
    return this.#db.table(tableName).clear()
  }

  disconnectedCallback() {
    // [ ] disconnect indexedDB
    if (!this.#db) return
    this.#db.close()
  }

}

window.customElements.define('data-store', DataStore)
