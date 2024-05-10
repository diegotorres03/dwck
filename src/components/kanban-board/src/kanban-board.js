
import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
  onDomReady,
} from '../../../global/web-tools'

import componentHtml from './kanban-board.html'
// import componentStyle from './deck-reader.css'
// import  from 'dragula'
import dragula from 'dragula'

class KanbanBoardComponent extends HTMLElement {

  get name() {
    return this.getAttribute('name') || 'Empty Board'
  }

  constructor() {
    super()

  }

  #init() {
    console.log('inside the kanban init', this.children)

    // dragula()
    console.log('dragula')
    console.log(dragula)
    const kanbanColumns = [...this.querySelectorAll('kanban-column')]
    console.log(kanbanColumns)
    dragula(kanbanColumns)
      .on('drag', (element, column) => {
        console.log('drag', element, column)
        element.setAttribute('data-column', column.id)
        element.setAttribute('column', column.id)

      }).on('drop', (element, column) => {

        const columnId = column.id
        const id = element.id
        console.log('moving', id, 'to column', columnId, element, column)

        const dropEvent = new CustomEvent(columnId, {
          bubbles: true, composed: true,
          detail: { id: id, column: columnId, _action: 'drop' },
        })

        this.dispatchEvent(dropEvent)

        const columnEvent = new CustomEvent('drop', {
          bubbles: true,
          detail: { id: id, column: columnId },
        })

        setTimeout(() => {
          column.dispatchEvent(columnEvent);
        }, 1);

        console.log('drop', element)
      }).on('over', (element, container) => {
        console.log('over', element)
      }).on('out', (element, container) => {
        console.log('out', element)
      });
  }

  connectedCallback() {

    const inner = html`
      <slot></slot>
      `
    // ${componentHtml}
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(inner)

    // const inner = await html.import('test.component.html')

    // replacing inline handler function with own component methods
    mapComponentEvents(this)

    // get variable names
    updateVars(this)

    onDomReady(() => this.#init())

    // // dragula()
    // console.log('dragula')
    // console.log(dragula)
    // const kanbanColumns = [...this.querySelectorAll('kanban-column')]
    // console.log(kanbanColumns)
    // dragula(kanbanColumns)
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('kanban-board', KanbanBoardComponent)
