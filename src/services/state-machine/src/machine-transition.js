import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
} from '../../../global/web-tools'

class MachineTransition extends HTMLElement {

  constructor() {
    super()
    const template = html`<slot></slot>`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)


  }

  async activate(event) {
    /**
     *
     *
     * @param {string} timeString
     */
    function parseTime(timeString) {
      let timeAmount
      let multiplier = 1
      if (timeString.includes('s')) {
        multiplier = 1000
        timeAmount = Number(timeString.replace('s', ''))
      } else if (timeString.includes('m')) {
        multiplier = 60 * 1000
        timeAmount = Number(timeString.replace('m', ''))
      } else if (timeString.includes('h')) {
        multiplier = 60 * 60 * 1000
        timeAmount = Number(timeString.replace('h', ''))
      }

      return timeAmount * multiplier

    }

    if (this.hasAttribute('wait')) {
      const wait = this.getAttribute('wait') || event.detail.wait
      // alert('waiting')
      await sleep(parseTime(wait))
    }
    const activateEvent = new CustomEvent('activate-state', {
      bubbles: true, composed: true,
      detail: { ...this.dataset, ...event.detail }
    })

    this.dispatchEvent(activateEvent)
  }

  connectedCallback() {
    //  mapComponentEvents(this)
    //  updateVars(this)
    const unregisterTriggers = registerTriggers(this, (event) => this.activate(event))


  }


  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('machine-transition', MachineTransition)
