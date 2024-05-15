import { DWCKComponent } from '../dwck-component.js'


export class WebComponent extends HTMLElement {

  static tag = 'web-component'
  // static tag = 'web-component'
  // static styles = new URL('./web-component.css', import.meta.url).hrer

  constructor() {
    super()
    console.log('constructing')
    import('../web-tools.js')
      .then(({ html }) => {
        // const template = html`` 
        const componentTemplate = this.querySelector('template')
        // console.log('this is the template', template)

        // this.attachShadow({ mode: 'open' })
        // this.shadowRoot.appendChild(template)
        
        const commponentTag = this.getAttribute('tag')

        // function ComponentClass() {
        //   // HTMLElement.call(this)
        //   // const htmlElement = new HTMLElement()
          
        //   this.attachShadow({ mode: 'open' })
        //   // this.shadowRoot.appendChild(componentTemplate.content.cloneNode(true))
        // }
        // ComponentClass.tag = commponentTag
        // ComponentClass.prototype = Object.create(HTMLElement.prototype)
        // ComponentClass.prototype.constructor = ComponentClass
        // ComponentClass.prototype.connectecCallback = function() {
        //   console.log('connectec callback carajo')
        // }

        // console.log(window.myFunction.toString())

        // class ComponentClass extends DWCKComponent {
        //   static tag = commponentTag

        //   constructor() {
        //     super()
        //     this.attachShadow({ mode: 'open' })
        //     console.log(componentTemplate)

        //     this.shadowRoot.appendChild(html`<h1>test</h1>`)
        //     // this.shadowRoot.appendChild(componentTemplate)
        //   }
          
        //   connectedCallback() {
        //     console.log('connected callback carajo')
        //     window.myFunction()
        //   }
        // }

        // console.log(ComponentClass)

        // customElements.define(ComponentClass.tag, ComponentClass)

        // const componentclass = new class child extends HTMLElement() {
        //   constructor() {
        //     super()
        //     this.attachShadow({ mode: 'open' })
        //     this.shadowRoot.appendChild(componentTemplate.content.cloneNode(true))
        //   }
        // }
        // componentclass.tag = commponentTag

        // console.log(new ComponentClass())

      }).catch(console.error)
  }





}


window.customElements.define(WebComponent.tag, WebComponent)



