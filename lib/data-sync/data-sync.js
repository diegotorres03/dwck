import {
  html,
  //   mapComponentEvents,
  //   updateVars,
  //   registerTriggers,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'




/**
 * This component enable sync to a rest api, or an appsync api
 *
 * @export
 * @class DataSyncComponent
 * @extends {HTMLElement}
 */
export default class DataSyncComponent extends DWCKComponent {

  static tag = 'data-sync'
  template = html`
    <h1 id="status" >a</h1>
    <slot></slot>
  `

  /** @property {WebSocket} #ws */
  #ws

  set status(value) {
    this.setAttribute('status', value)
  }

  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    registerTriggers(this, (event) => {
      // this.sync(event)
      console.log(event.detail)
      console.log(event.target.name)

      const eventToSend = {
        action: 'event', // the value should map with a route on apigateway ws
        event: 'accepted', // the event name used on the recipient of this event
        recipientId: this.getAttribute('recipient-id') || this.getAttribute('user-id'),
        data: { ...event.detail, ...this.dataset } // payload
      }

      console.info('eventToSend', eventToSend)

      this.#ws.send(JSON.stringify(eventToSend))
    })

    const url = this.getAttribute('url')
    console.log('url', url)
    const ws = new WebSocket(url)
    this.#ws = ws
    this.#ws.addEventListener('open', (event) => {
      console.log(event)
      this.status = 'active'

      const userId = this.getAttribute('user-id')
      const id = this.getAttribute('id')
      const loginEvent = { action: 'login', userId, id }
      console.info('loginEvent', loginEvent)
      this.#ws.send(JSON.stringify(loginEvent))

    })

    this.#ws.addEventListener('close', (event) => {
      console.log(event)
      this.status = 'inactive'
    })

    this.#ws.addEventListener('error', (event) => {
      console.log('error')
      console.log(event)
      this.status = 'error'
    })

    this.#ws.addEventListener('message', (event) => {
      console.log(event)
      const detail = JSON.parse(event.data)
      console.log('detail', detail)
      this.status = 'receiving'
      const eventName = detail.event
      const eventData = detail.data
      this.dispatch(eventName, eventData)
      this.dispatch('sync', eventData)
    })


  }

  /**
   * this one is called when the component is triggered
   * is responsable to check the most recent events and reproduce them
   *
   * @memberof DataSyncComponent
   */
  sync(event) {
    console.log(event)

  }


}

window.customElements.define('data-sync', DataSyncComponent)
