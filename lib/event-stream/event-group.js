import { DWCKComponent } from '../dwck-component.js'



export class EventGroupComponent extends DWCKComponent {
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


    Array.from(this.querySelectorAll('event-source'))
      .forEach(eventSource => {
        eventSource.addEventListener('data', event => this.emit(event))
        eventSource.addEventListener('loaded', event => this.emit(event))
      })
  }

  async emit(event) {
    const { runFilters, runTransforms, } = await import('./tools.js')

    const filterResult = runFilters(event, this.getAttribute('filter'))
    if (!filterResult) return

    const transformedData = runTransforms(event, this.getAttribute('transform'))

    // console.info(`${this.id} emiting ${this.DEFAULT_EVENT_NAME}`, event)
    this.dispatchEvent(new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: false, composed: true,
      detail: transformedData,
    }))
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('event-group', EventGroupComponent)
