import { DWCKComponent } from '../dwck-component.js'
import { KanbanColumnComponent } from './kanban-column/kanban-column.js'

// import componentHtml from './kanban-board.html'
// import componentStyle from './deck-reader.css'
// import  from 'dragula'
// import dragula from '../../node_modules/dragula/dragula.js'

export class KanbanBoardComponent extends DWCKComponent {
  path = import.meta.url
  template = './kanban-board.html'
  styles = ['./kanban-board.css']

  static get observedAttributes() {
    return ['title']
  }

  set title(value) {
    if (!value || value == '') return
    this.updateVars()
  }

  get title() {
    return this.getAttribute('title')
  }

  constructor() {
    super()

    this.addEventListener('componentReady', async () => {
      const kanbanColumns = document.getElementById('miElemento')
    })

    // this.addEventListener('componentReady', () => mapComponentEvents(this))
  }

  async #init() {
    const { dragula: drake } = await import('../../builds/dragula.bundle.js')
    const kanbanColumns = [...this.querySelectorAll('kanban-column')]

    drake(kanbanColumns)
      .on('drag', (element, column) => {
        element.setAttribute('data-column', column.id)
        element.setAttribute('column', column.id)

        console.log(
          `[DRAG] Draggin <${element.tagName}> element by "${column.id}" column`
        )
      })
      .on('drop', (element, column) => {
        const columnId = column.id
        const id = element.id

        console.log(
          `[DROP] Dropped <${element.tagName}> element in "${column.id}" column`
        )

        const now = Date.now()
        // const duration = element.hasAttribute('data-timestamp') ?
        // (now - Number(element.getAttribute('data-timestamp'))) : 0

        const timestamp = Number(element.getAttribute('data-timestamp')) || now
        // console.log('times: now', new Date(now).toLocaleString())
        // console.log('times: start', new Date(timestamp).toLocaleString())
        // console.log('times: math', now, timestamp, now - timestamp)

        const duration = Math.round((now - timestamp) / 1000) // 60 to have minutes

        // console.log('duration', duration)

        const dropEvent = new CustomEvent(columnId, {
          bubbles: true,
          composed: true,
          detail: {
            id: id,
            column: columnId,
            _action: 'drop',
            timestamp: now,
            duration
          }
        })

        this.setAttribute('data-timestamp', now)
        element.dispatchEvent(dropEvent)

        // this will be the main event
        const columnEvent = new CustomEvent('change', {
          bubbles: true,
          detail: {
            ...element.dataset,
            timestamp: now,
            id: id,
            duration
            //  column: columnId
          }
        })

        setTimeout(() => {
          column.dispatchEvent(columnEvent)
        }, 1)

        // console.log("drop", element)
      })
      .on('over', (element, container) => {
        // console.log('over', element)
      })
      .on('out', (element, container) => {
        // console.log('out', element, container)
      })
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers, sleep } = await import(
      '../web-tools.js'
    )
    onDomReady(() => this.#init())
  }
}

window.customElements.define('kanban-board', KanbanBoardComponent)
