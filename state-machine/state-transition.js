import { DWCKComponent } from '../lib/dwck-component.js'


class MachineTransition extends DWCKComponent {

  constructor() {
    super()
  }

  async activate(event) {
    const { sleep } = await import('../lib/web-tools.js')

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
    this.dispatch('activate-state', { ...this.dataset, ...event.detail }, { bubbles: true })

  }

  async connectedCallback() {
    const { registerTriggers } = await import('../lib/web-tools.js')
    registerTriggers(this, (event) => this.activate(event))


  }


  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('machine-transition', MachineTransition)
