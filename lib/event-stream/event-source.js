
import { DWCKComponent } from '../dwck-component.js'

export class EventSourceComponent extends DWCKComponent {

  get DEFAULT_EVENT_NAME() {
    return 'data'
  }

  defaultEventName = 'data'

  get #transformNames() {
    if (!this.getAttribute('transform')) return []
    return this.getAttribute('transform').split(/[,]/g).map(fnName => fnName.trim())
  }
  get #fitlerNames() {
    if (!this.getAttribute('filters')) return []
    return this.getAttribute('filters').split(/[,]/g).map(fnName => fnName.trim())
  }

  get #eventSource() {
    return {
      trigger: this.getAttribute('trigger'),
      triggerEvent: this.getAttribute('on'),
      dataset: { ...this.dataset }
    }
  }

  constructor() {
    super()

  }



  async connectedCallback() {
    const { onDomReady, registerTriggers, sleep, parseTime } = await import('../web-tools.js')

    // acomodating window load
    await onDomReady()

    registerTriggers(this, (event) => this.emit(event))
    if (
      this.getAttribute('trigger') === 'window' &&
      this.getAttribute('on') === 'load'
    ) {
      const waitTime = Number(this.getAttribute('wait'))
      // waiting
      if (this.hasAttribute('wait')) {
        const wait = this.getAttribute('wait')
        await sleep(parseTime(wait))
      }
      await sleep(300)
      this.dispatch('data', { ...this.dataset })
    }
  }

  async emit(event) {
    const { runFilters, runTransforms, } = await import('./tools.js')


    let shouldPass = true
    this.#fitlerNames
      .map(filterName => runFilters(event, filterName))
      .forEach(res => {
        shouldPass = shouldPass && res
      })

    if (!shouldPass) return


    const transformedData = runTransforms(event, this.getAttribute('transform'), this.#eventSource)

    const newEvent = new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: false, composed: true,
      detail: transformedData,
    })
    // console.info(`${this.id} emiting ${this.DEFAULT_EVENT_NAME}`, event)
    this.dispatchEvent(newEvent)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('event-source', EventSourceComponent)
