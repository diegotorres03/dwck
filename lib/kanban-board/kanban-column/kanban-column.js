import { html } from "../../web-tools.js"
import { DWCKComponent } from "../../dwck-component.js"

// import componentStyle from './simple-card.css'

export class KanbanColumnComponent extends DWCKComponent {
  path = import.meta.url
  template = "./kanban-column.html"
  styles = ["./kanban-column.css"]

  static get observedAttributes() {
    return ["title"]
  }


  #titleQueue = []

  set title(value) {
    if(!value || value == '') return
    // this.update()
    this.updateVars()
  }

  get title() {
    return this.getAttribute("title") || this.id
  }

  constructor() {
    super()
    // this.addEventListener('componentReady', () => mapComponentEvents(this))
  }

  #init() {
    Array.from(this.children).forEach((child) =>
      child.setAttribute("data-column", this.id)
    )

  }

  async connectedCallback() {
    const { onDomReady, registerTriggers, sleep } = await import(
      "../../web-tools.js"
    )
    await onDomReady()

    registerTriggers(this, (event) => console.log(event))
    this.#init()


    // const value = this.#titleQueue.shift()
    // if(!value) return
    // console.log('adding', value)
    // const title = this.shadowRoot.querySelector('#title')
    // console.log(title)
    // if (title) title.textContent = value
    // else alert('no joda')
  }
}

window.customElements.define("kanban-column", KanbanColumnComponent)
