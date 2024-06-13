import {
  registerTriggers,
  initializeValues,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'


/**
 * this class will listen to events and repeat the content inside, 
 * it will add ui-data-sync to make items auto update and it will route the 
 * rigth event to the right ui-data-sync
 *
 * @export
 * @class UIDataRepeatComponent
 * @extends {HTMLElement}
 */
export class UIDataRepeatComponent extends DWCKComponent {

  get #template() {
    const selector = this.getAttribute('template')
    return this.querySelector('template') || document.querySelector(selector)
  }
  set #template(val) {

  }

  #children
  #childrenMap = new Map()
  constructor() {
    super()
    this.addEventListener('componentReady', () =>
      this.#mapChildren())
  }


  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')

    onDomReady(() => {
      console.log('ui-data-repead ready')

      // mapComponentEvents(this)
      // updateVars(this)
      registerTriggers(this, (event) => {
        console.log(event)

        // [x] check filters first
        const filterName = this.getAttribute('filter')
        const filterFn = window[filterName]

        if (typeof filterFn === 'function') {
          console.log('filterFn', filterFn)
          const pass = filterFn(event, { ...this.dataset })
          if (!pass) return
        }


        // [ ] perform transforms
        const transformName = this.getAttribute('transform')
        const transformFn = window[transformName]
        if (typeof transformFn === 'function') {
          console.log('transformFn', transformFn)
          const result = transformFn(event, { ...this.dataset })
          console.log('transform: result', result)
          // [ ] figure out how to deal with the result. I can't update event.detail is readonly
        }

        /// /////
        if (event.detail._action === 'del') {
          this.#childrenMap.delete(event.detail.id)
          return this.#removeItem(event.detail.id)
        }
        if (this.#childrenMap.has(event.detail.id)) { // slowly deprecate the __id
          return this.#updateItem(event)
        }
        this.#appendItem(event)
      })
    })

  }

  #mapChildren() {
    // this.#template
    this.#childrenMap = new Map()
    const children = Array.from(this.children)
    console.log('allChildren', children)

    if (this.hasAttribute('template')) {
      const templateId = this.getAttribute('template')
      const template = document.querySelector(('#' + templateId).replace('##', '#'))
      console.log('template', template)
      this.#template = template
      return
    }

    this.#children = children.filter(child => {
      if (child.tagName.toLowerCase() === 'template') {
        this.#template = child
        return false
      }
      this.#childrenMap.set(child.id, child)
      return true
    })

  }



  /**
   * 
   * @returns {HTMLTemplateElement}
   */
  #cloneTemplate() {
    if (!this.#template) {
      console.log(this.querySelector('template'))
      // return console.warn('no template foud')
      this.#template = this.querySelector('template')
    }
    return this.#template.content.cloneNode(true)
  }

  #removeItem(id) {
    const itemId = `${id}`
    console.log('removing item', itemId)

    const target = this.#getTarget()
    console.log(target)
    const item = target
      .querySelector(`#${itemId}`)
    console.log('item to remove', item)
    item.remove()

  }

  #updateItem() {
    console.log('updating')
  }

  #getTarget() {
    let target

    if (this.hasAttribute('target')) {

      // Here, add a target attribute, if is set, do the append there
      const selector = this.getAttribute('target')
      console.log('Selector', selector)
      return target = this.shadowRoot.querySelector(selector) ||
        document.querySelector(selector)

    }
    return this

  }

  #appendItem(event) {
    if (!this.id) this.setAttribute('id', `` + Date.now())
    console.log('adding', event)

    let contentToAppend = this.#template.content.cloneNode(true)
    const editBtn = contentToAppend.querySelector('button[name="edit"]')
    const deleteBtn = contentToAppend.querySelector('button[name="delete"]')


    // this add the values to the template in order to append it
    initializeValues(contentToAppend, event)
    console.log(contentToAppend.nodeType)

    if (editBtn) {
      Object.keys(event.detail).forEach(key => {
        if (key === '__eventSource') return // || key === '__id'
        editBtn.setAttribute(`data-${key}`, event.detail[key])
      })
      editBtn.addEventListener('click', ev => this.dispatchEvent(
        new CustomEvent(`edit`, { bubbles: false, composed: true, detail: editBtn.dataset })
      ))
    }

    if (deleteBtn) {
      deleteBtn.setAttribute('data-__id', event.detail.__id)
      deleteBtn.addEventListener('click', ev => this.dispatchEvent(
        new CustomEvent(`delete`, { bubbles: false, composed: true, detail: deleteBtn.dataset })
      ))
    }


    // [ ] Autosync is adding the ui-data-sync, but is using the same event source for all of them, so when a new on is created, all of them will change value

    console.log('autosync', this.hasAttribute('autosync'))
    if (this.hasAttribute('autosync')) {

      const dataSync = document.createElement('ui-data-sync')
      const dataSyncId = `${this.id}_${event.detail.id || Date.now()}`
      dataSync.setAttribute('id', dataSyncId)
      dataSync.setAttribute('trigger', `#${this.id}`)
      dataSync.setAttribute('event', dataSyncId)
      dataSync.appendChild(copy)
      contentToAppend = dataSync
      this.#emit(event, dataSyncId)
    }


    const target = this.#getTarget()
    // console.log('contentToAppend', [...contentToAppend.children].pop())

    const newElementId = [...contentToAppend.children].pop().id
    if (newElementId !== '' && target.querySelector(`#${newElementId}`)) {
      const existingItem = target.querySelector(`#${newElementId}`)
      // contentToAppend
      existingItem?.remove()
      // target.parentElement.replaceChild(existingItem, contentToAppend)
    }

    console.log('almost appending the stuff', contentToAppend)
    // document.body.appendChild(contentToAppend)
    target.appendChild(contentToAppend)


    // notify all other components to refresh triggers
    const refreshTriggerEvent = new CustomEvent('refresh-triggers', {
      bubbles: false, composed: false,
    })
    window.dispatchEvent(refreshTriggerEvent)


  }

  #emit(event, eventName = 'data') {
    if (!event) return
    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: false, composed: true,
      detail: { ...event.detail },
    }))


  }

}

window.customElements.define('ui-data-repeat', UIDataRepeatComponent)
