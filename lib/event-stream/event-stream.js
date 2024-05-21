
import { DWCKComponent } from '../dwck-component.js'
import { runFilters, runTransforms } from './tools.js'
import { EventSourceComponent } from './event-source.js'
import { EventGroupComponent } from './event-group.js'


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

export class EventStreamComponent extends DWCKComponent {
  get DEFAULT_EVENT_NAME() {
    return 'data'
  }

  constructor() {
    super()
  }


  async connectedCallback() {
    const { registerTriggers, onDomReady } = await import('../web-tools.js')
    await onDomReady()
    registerTriggers(this, (event) => this.emit(event))


    Array.from(this.querySelectorAll('event-group'))
      .forEach(eventSource => eventSource
        .addEventListener('data', event => this.emit(event)))
  }

  emit(event) {
    const filterResult = runFilters(event, this.getAttribute('filter'))
    if (!filterResult) return

    const transformedData = runTransforms(event, this.getAttribute('transform'))

    this.dispatchEvent(new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: true, composed: true,
      detail: transformedData,
    }))
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('event-stream', EventStreamComponent)
