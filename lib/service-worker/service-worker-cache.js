// import {
//   html,
//   mapComponentEvents,
//   updateVars,
//   registerTriggers,
// } from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'

export class ServiceWorkerCacheComponent extends DWCKComponent {

  constructor() {
    super()
    const template = html``
     this.attachShadow({ mode: 'open' })
     this.shadowRoot.appendChild(template)
  }


  connectedCallback() {
    // mapComponentEvents(this)
    // updateVars(this)
    // registerTriggers(this, (event) => console.log(event))
  }


}

window.customElements.define('service-worker-cache', ServiceWorkerCacheComponent)
