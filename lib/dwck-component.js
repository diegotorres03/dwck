
export class DWCKComponent extends HTMLElement {
  // static attributes = ['title', 'description', 'image', 'link']

  static currentPath = ''
  static styles = ['./style.css']
  // static template = './content.html'

  template

  set title(value) {
    // code to run once the attribute is set
  }

  get title() {
    return this.getAttribute('title')
  }
  styles = ['./default-styke.css']


  static get observedAttributes() {
    // return 
    console.log('observing', DWCKComponent.attributes)
    return DWCKComponent.attributes
  }

  constructor() {
    super()
    console.log('constructing')
    this.attachShadow({ mode: 'open' })
    console.log('import.meta.url', import.meta.url)
    import('./web-tools.js')
      .then(({ html }) => {
        
        let template
        try {
          
          template = document.querySelector(this.template).content.cloneNode(true)
        } catch(err) {
          // console.error(err)
          template = html`<small>sad</small>`
        }
        
        console.log('==>',this.template, template)

        // const template = html`<style></style><slot>plain-card</slot>`
        this.shadowRoot.appendChild(template)
      }).catch(console.error)
  }

  async connectedCallback() {
    console.log('importing')
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue
  }

  adoptedCallback() { }

}



