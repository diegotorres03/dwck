// import {
//   html,
//   mapComponentEvents,
//   updateVars,
//   registerTriggers,
// } from '../web-tools.js'
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


  constructor() {
    super()
  }

  async connectedCallback() {
    const { registerTriggers } = await import('../web-tools.js')
    registerTriggers(this, (event) => this.sync(event))
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

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('data-sync', DataSyncComponent)
