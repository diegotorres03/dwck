import { DWCKComponent } from '../dwck-component.js'



export class HttpRequestComponent extends DWCKComponent {

  path = import.meta.url

  constructor() {
    super()
    console.log('HttpRequestComponent')
  }

  async connectedCallback() {

    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    registerTriggers(this, (event) => {

      this.request(event)
    })
  }

  async request(event) {
    const { html } = await import('../web-tools.js')
    const url = this.getAttribute('url')
    const method = this.getAttribute('method')?.toUpperCase() || 'GET'
    const body = event.detail
    // const headers = this.dataset.headers
    const options = {
      method,
      headers: {}
    }
    if (method.toUpperCase() === 'POST' && this.getAttribute('content-type') === 'json') {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }

    if (method.toUpperCase() === 'POST' && this.getAttribute('content-type') === 'html') {
      options.headers['Content-Type'] = 'text/html'
      const body = this.innerHTML
      options.body = body
    }

    const res = await fetch(url, options)
    // .catch(err => {
    //   console.log('err', err)
    //   console.log('err', err)
    // })

    const contentType = this.getAttribute('content-type') || 'html'

    if (contentType === 'html' || contentType === 'text/html') {
      const txt = await res.text()
      const responseHtml = html`${txt}`
      const targetSelector = this.getAttribute('target')
      const target = document.querySelector(targetSelector) || this.querySelector(targetSelector) || this.shadowRoot.querySelector(targetSelector)
      if (target) {
        if (!this.hasAttribute('append')) {
          target.innerHTML = ''
        }
        console.log('txt', txt)
        target.appendChild(responseHtml)
        this.dispatch('response', { html: responseHtml })
      }

    } else if (contentType === 'json' || contentType === 'application/json') {
      const json = await res.json()
        .catch(err => {
          console.error(err)
          return {}
        })
      this.dispatch('response', { json })
    }
  }


}



window.customElements.define('http-request', HttpRequestComponent)