
import { DWCKComponent } from '../dwck-component.js'

export class StateTransitionComponent extends DWCKComponent {
  static tag = 'state-transition'
  constructor() {
    super()

  }

  async activate(event) {
    console.log('activating transition')
    const { parseTime, sleep } = await import('../web-tools.js')

    // filtering the event
    if (this.hasAttribute('filter')) {
      const filter = this.getAttribute('filter')
      console.log('filtering event', filter)
      const filterFn = window[filter]
      let filterPass = filterFn(event.detail)
      if (this.hasAttribute('not')) filterPass = !filterPass
      if (!filterPass) return
    }

    // waiting
    if (this.hasAttribute('wait')) {
      console.log('waiting for', this.getAttribute('wait'))
      const wait = this.getAttribute('wait') || event.detail.wait
      // alert('waiting')
      await sleep(parseTime(wait))
    }
    const activateEvent = new CustomEvent('activate-state', {
      bubbles: true, composed: true,
      detail: { ...this.dataset, ...event.detail }
    })
    console.log('dispatching activate event', activateEvent)

    this.dispatchEvent(activateEvent)
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    console.info('state-transition connected')
    onDomReady(() => {
      const unregisterTriggers = registerTriggers(this, (event) => {
        console.log('trigger event on transition', event)
        this.activate(event)
      })
    })
  }


}

window.customElements.define(StateTransitionComponent.tag, StateTransitionComponent)
