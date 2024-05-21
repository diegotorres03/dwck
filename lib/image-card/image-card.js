import { DWCKComponent } from '../dwck-component.js'
// import { html } from '../web-tools'



export class ImageCardComponent extends DWCKComponent {

  static tag = 'image-card'

  path = import.meta.url // TOCA!!!
  // template = html`<slot></slot>`
  template = './image-card.html'


  constructor() {
    super()
  }


  async connectedCallback() {
    const { registerTriggers } = await import('../web-tools.js')
    registerTriggers(this, event => {
      console.log('event', event)
    })

  }


}

window.customElements.define(ImageCardComponent.tag, ImageCardComponent)


