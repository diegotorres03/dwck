
import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep
} from '../../../global/web-tools'

import componentHtml from './kanban-board.html'
// import componentStyle from './deck-reader.css'
// import  from 'dragula'
import dragula  from 'dragula'

class KanbanBoardComponent extends HTMLElement {

  get name(){
    return this.getAttribute('name') || 'Empty Board'
  }

  constructor() {
    super()
    
  }

  connectedCallback() {

    const inner = html`
      ${componentHtml}
    `
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(inner)

    // const inner = await html.import('test.component.html')

    // replacing inline handler function with own component methods
    mapComponentEvents(this)

    // get variable names
    updateVars(this)

    // dragula()
    console.log('dragula')
    console.log(dragula)
    const kanbanColumns = [...this.querySelectorAll('kanban-column')]
    console.log(kanbanColumns)
    dragula(kanbanColumns)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('kanban-board', KanbanBoardComponent)
