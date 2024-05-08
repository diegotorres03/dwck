import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
} from '../../../global/web-tools'

// import { setItem, getItem, removeItem } from 'localforage'
import { Dexie } from 'dexie'

import localforage from 'localforage'
import DataSetComponent from './data-set'
import DataQueryComponent from './data-query'


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
export default class DataStore extends HTMLElement {

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
    const template = html`<slot></slot>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)
    // console.log(`${this.id}_key`)
    // setItem('test', { test: true, success: true })

    const dbName = this.id || 'default'
    console.log('dbName', dbName)
    this.#db = new Dexie(dbName)

    this.#dataSets = Array.from(this.querySelectorAll('data-set'))
  }


  #dbInit() {
    // const version = Number(this.getAttribute('version')) || 1
    // const dbName = this.id || 'default'
    // console.log('dbName', dbName)
    // const db = new Dexie(dbName)
    // db.
    const stores = {}
    const version = Number(this.getAttribute('version')) || 1

    Array.from(this.querySelectorAll('data-set')).forEach(dataset => {
      const indexes = [...dataset.querySelectorAll('data-index')]
      console.log('dataset', dataset)
      const indexDefinitions = indexes.map(index =>
        `${index.hasAttribute('autoincrement') ? '++' : ''}${index.getAttribute('key')}`)
      console.log('indexDefinitions', indexes, indexDefinitions)
      stores[dataset.id] = indexDefinitions.length > 0 ?
        indexDefinitions.join(', ') :
        'id'
    })

    console.log('stores', stores, version)
    console.table(stores)
    const versionDeployment = this.#db.version(version).stores(stores)
    console.log('versionDeployment', versionDeployment)

    // this.#db.tables.forEach(table => {
    //   console.log('table', table)
    // })




  }

  async connectedCallback() {
    // mapComponentEvents(this)
    // updateVars(this)
    registerTriggers(this, (event) => this.#processEvent(event))

    const version = Number(this.getAttribute('version'))
    await sleep(1)
    this.#dbInit()

    const listenToSync = async event => {
      const key = event.detail.key
      console.log('sync data-store', key)
      // const items = await this.getItem(key)
      const items = await this.listItems(key, event.detail)
      const dataSet = this.querySelector(`#${event.detail.key}`)

      const getEvent = (item) => new CustomEvent('syncItem', { detail: item })


      console.log(items)
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

    console.log('this.#dataSets', this.#dataSets)


    this.#dataSets.forEach(dataSet => {
      const { list, get, del, clear, put } = DataQueryComponent.EVENT_TYPES
      console.log('data-set id=', dataSet.id)
      dataSet.addEventListener(put, event => this.#processCrudEvent(event, put))
      dataSet.addEventListener(list, event => this.#processCrudEvent(event, list))
      dataSet.addEventListener(get, event => this.#processCrudEvent(event, get))
      dataSet.addEventListener(del, event => this.#processCrudEvent(event, del))
      dataSet.addEventListener(clear, event => this.#processCrudEvent(event, clear))
      dataSet.setAttribute('store', this.id)
    })

    this.addEventListener('updated', event => this.#processEvent(event))

  }

  async #processEvent(event) {
    console.log(event)
    const isBtn = event.target.tagName.toLowerCase() === 'button'
    let data = isBtn ? { ...event.target.dataset } : event.detail
    const tableName = event.target.id


    console.log('processEvent', tableName, event)

    // const userData = {
    //   id: data.id,
    //   name: data.name,
    //   age: data.age,
    // }

    console.table(data)
    const table = this.#db.table(tableName)

    if (this.hasAttribute('append') || event.target.hasAttribute('append')) {
      const res = await table.where('id').between(1, 10).toArray()
      console.log(res)
      data.id = res.length + 1

      return table.add(data)
    }

    if (!data.id) data.id = data.name
    return table.put(data, data.__id || data.id)

  }

  async #processCrudEvent(event, queryType) {
    const { list, get, del, clear, put } = DataQueryComponent.EVENT_TYPES
    console.table(event)
    const table = event.target.id
    console.table('table', table)
    if (queryType === list) {
      const listRes = await this.listItems(table, event.detail)
      // and now I don't know what is the next step xD
    } else if (queryType === clear) {
      await this.clear(table)
    } else if (queryType === del) {
      console.log('deleting', event.detail)
      const id = event.detail.id
      // console.log(event.target)
      // console.log(event.target.removeItem)
      // event.target.removeItem(id)
      this.removeItem(table, id)
        .then(res => console.log('deleted', res))
        .catch(err => console.error(err))

    }

  }

  /**
   * Save an object on IndexedDB under a given key (this key will be prefixed with the store name)
   * @param {string} key data store key to be used
   * @param {*} value value to be stored on this data store key
   * @returns {*} 
   */
  setItem(key, value) {
    // return localforage.setItem(`${this.id}_${key}`, value)
    // if(!this.#db) return console.warn('db not initialized')
    // this.#db.table(tableName).add({
    //   id: 'diego',
    //   name: 'Diego Torres',
    //   age: 30,
    // })

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
   * @param {string} key 
   * @returns {*}
   */
  getItem(key) {
    // return localforage.getItem(`${this.id}_${key}`)
  }

  hasItem(key) {
    // return !!this.getItem(`${this.id}_${key}`)
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
