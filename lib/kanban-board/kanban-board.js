
import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,
  onDomReady,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'
import { KanbanColumnComponent } from './kanban-column.js'

// import componentHtml from './kanban-board.html'
// import componentStyle from './deck-reader.css'
// import  from 'dragula'
// import dragula from '../../node_modules/dragula/dragula.js'


export class KanbanBoardComponent extends DWCKComponent {

  path = import.meta.url
  template = './kanban-board.html'

  static get observedAttributes() {
    return ['name']
  }

  set name(value) {
    // this.update()
    // console.log('setting value', value)
    // import('../web-tools.js').then(({ updateVars }) => updateVars(this))
    // this.updateVars()
  }
  get name() {
    return this.getAttribute('name')
  }


  constructor() {
    super()

    // this.addEventListener('componentReady', () => mapComponentEvents(this))
  }

  async #init() {
    // const dragula = await import('../../node_modules/dragula/dist/dragula.js')
    const { dragula } = await import('../../builds/dragula.bundle.js')
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

  async connectedCallback() {
    const { onDomReady } = await import('../web-tools.js')
    onDomReady(() => this.#init())

    // // dragula()
    // console.log('dragula')
    // console.log(dragula)
    // const kanbanColumns = [...this.querySelectorAll('kanban-column')]
    // console.log(kanbanColumns)
    // dragula(kanbanColumns)
  }


}

window.customElements.define('kanban-board', KanbanBoardComponent)
