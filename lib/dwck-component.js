
export class DWCKComponent extends HTMLElement {
  // static attributes = ['title', 'description', 'image', 'link']

  static currentPath = ''
  // static styles = ['./style.css']
  // static template = './content.html'

  template


  set title(value) {
    // code to run once the attribute is set
  }

  get title() {
    return this.getAttribute('title')
  }
  styles = []


  static get observedAttributes() {
    // return 
    // console.log('observing', DWCKComponent.attributes)
    return DWCKComponent.attributes
  }

  // event for slot changes
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event
  constructor() {
    super()

    /**
     *
     *
     * @param {string} stlyleSource can be a css selector, can be a relative path or can be inline css
     * @return {Node} 
     */
    const getStyle = (stlyleSource) => {
      let element
      if (stlyleSource.includes('.css')) {
        const styleUrl = new URL(stlyleSource, this.path).href
        element = document.createElement('link')
        element.setAttribute('rel', 'stylesheet')
        element.setAttribute('href', styleUrl)
        // }else if(stlyleSource.includes('<style>')) {
        //   element = document.createElement('style')
        //   element.innerHTML = stlyleSource
      } else if (stlyleSource.startsWith('#')) {
        element = document.querySelector(stlyleSource)
      } else {
        element = document.createElement('style')
        element.innerHTML = stlyleSource
      }
      return element
    }

    this.attachShadow({ mode: 'open' })
    import('./web-tools.js')
      .then(({ html }) => {

        return new Promise((resolve => {
          resolve(document.querySelector(this.template).content.cloneNode(true))
        }))
          .catch(() => {
            if (typeof this.template === 'string') {
              const url = new URL(this.template, this.path).href
              console.info('importing from url', url)
              return html.import(url)
            }
            return this.template || html`<slot></slot>`
          })
      })
      .then(template => {
        this.styles.map(getStyle).forEach(style => {
          template.appendChild(style)
        })
        this.shadowRoot.appendChild(template)

        this.dispatch('componentReady', {})

      })
      .catch(err => {
        console.error(err)
        // this.shadowRoot.appendChild(html`<b>there is not a template defined</b>`)
      })

  }

  updateVars() {
    import('./web-tools.js')
      .then(({ updateVars }) => updateVars(this))
  }

  async update() {
    const variables = Array.from(
      this.shadowRoot.querySelectorAll('.variable'),
    )
    console.log('variables', variables, this.shadowRoot.querySelector('b'))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue
    this.updateVars()
  }

  /**
   *
   *
   * @param {string} eventName
   * @param {*} detail
   * @param {{bubbles: boolean, composed: boolean}} options
   * @memberof DWCKComponent
   */
  dispatch(eventName, detail, options) {
    const { bubbles, composed } = options || { bubbles: false, composed: true }
    const event = new CustomEvent(eventName, { detail, bubbles: !!bubbles, composed: !!composed })
    this.dispatchEvent(event)
  }


}



