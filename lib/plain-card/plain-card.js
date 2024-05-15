
import { DWCKComponent } from '../dwck-component.js'

console.log('plain card')

const processAttributeChange = (instance, name, oldValue, newValue) => {
  console.log('processAttributeChange', name, oldValue, newValue, this, instance)
  instance[name] = newValue
}


export class PlainCardComponent extends DWCKComponent {

  static currentPath = import.meta.url
  static styles = ['./plain-card.css']
  // static template = './plain-card.html'
  // static template = '#plain-card-template'

  static tag = 'plain-card'
  // static attributes = ['title']
  static get observedAttributes() { return ['title', 'date'] }

  set title(value) {
    console.log('setting title', value)
    // code to run once the attribute is set
  }

  set date(value) {
    console.log('setting date', value)
    // code to run once the attribute is set
  }

  get title() {
    return this.getAttribute('title')
  }

  styles = ['./plain-card.css']
  // template = './plain-card.html'
  template = '#plain-card-template'


  constructor() {
    super()
    // this.attachShadow({ mode: 'open' })
    // import('../web-tools.js')
    //   .then(({ html, getAbsolutePath, }) => {
    //     const template = html`<slot>plain-card</slot>`
    //     this.shadowRoot.appendChild(template)
    //   }).catch(console.error)
  }



}

// export default function registerPlainCardComponent() {
//   window.customElements.define(PlainCardComponent.tag, PlainCardComponent)
// }
window.customElements.define(PlainCardComponent.tag, PlainCardComponent)

