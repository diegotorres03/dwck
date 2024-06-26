// [ ] should I deprecate this in favor of the native data element?

import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'



//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

/**
 * Al the starting point we will find `data-point` tags, this will represent a single data entry.
 * use `data-` attributes to store the values, tag attributes will be used by the component.
 *
 * @export
 * @emits added - when a new item is attached to the dom
 * @emits updated - when an existing data-point values change // [ ] implement this
 * @class DataPointComponent
 * @extends {HTMLElement}
 */
export class DataPointComponent extends DWCKComponent {
  get DEFAULT_EVENT_NAME() {
    return 'added'
  }
  template = html`<span></span>
      ${this.hasAttribute('visible') ?
      this.hasAttribute('pretty') ?
        JSON.stringify(this.dataset, undefined, 2) :
        JSON.stringify(this.dataset) + `<hr>` : ''}
    `

  constructor() {
    super()
    this.addEventListener('componentReady', () => {
      const children = Array.from(this.querySelectorAll('data-rel'))
      children.forEach(child => child.setAttribute('from', `#${this.id}`))
    });

  }


  connectedCallback() {
    onDomReady(() => {
      this.dispatch(this.DEFAULT_EVENT_NAME, { details: this.dataset }, { bubbles: true })

    })
  }


}

window.customElements.define('data-point', DataPointComponent)
