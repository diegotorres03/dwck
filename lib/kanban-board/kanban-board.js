import { DWCKComponent } from '../dwck-component.js'
import { select, selectAll } from '../web-tools.js'
import { KanbanColumnComponent } from './kanban-column/kanban-column.js'

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
      const leftScrollBtn = select('.left-box__btn', this.shadowRoot)
      const rightScrollBtn = select('.right-box__btn', this.shadowRoot)
      const kanbanContainer = select(
        '.kanban-board__container',
        this.shadowRoot
      )

      rightScrollBtn.addEventListener('click', () => {
        // kanbanContainer.scrollLeft -= 200
        kanbanContainer.scrollBy({ left: 150, behavior: 'smooth' })
      })

      leftScrollBtn.addEventListener('click', () => {
        // kanbanContainer.scrollLeft -= 200
        kanbanContainer.scrollBy({ left: -150, behavior: 'smooth' })
      })
    })

    // this.addEventListener('componentReady', () => mapComponentEvents(this))
  }

  // [ ]: cambio de columna con focus -> ctrl+arrow
  // [x]: añadir botón que reemplace a los scroll
  // [ ]: Rediseñar para permitir un modo expandido
  // [ ]: Estilizar animaciones
  // [x]: Mientras se está grabbing una card y se apunta durante .5s a un borde que se mueva el scroll

  async #init() {
    // IMPORTAR DRAGULA
    const { dragula } = await import('../../builds/dragula.bundle.js')

    // Extraer elementos del Kanban
    const kanbanContainer = select('.kanban-board__container', this.shadowRoot)
    const kanbanColumns = selectAll('kanban-column', this)

    // Añadir IDs automáticos segun el nombre de las columnas
    kanbanColumns.map(column => {
      column.setAttribute('id', column.title.toLowerCase().replace(' ', '-'))
    })

    // [SCROLL AUTOMATICO]
    let scrollDirection = null // Dirección actual del scroll
    let scrollInterval = null // Intervalo activo para el scroll

    // Función para el scroll automático
    const handleAutoScroll = e => {
      const rect = kanbanContainer.getBoundingClientRect()

      // Detectar si el mouse está cerca del borde derecho del contenedor
      if (e.clientX > rect.right - 40) {
        console.log('[DERECHA]')
        if (scrollDirection !== 'right') {
          scrollDirection = 'right'
          clearInterval(scrollInterval)
          scrollInterval = setInterval(() => {
            kanbanContainer.scrollBy({ left: 150, behavior: 'smooth' })
          }, 400)
        }
      }
      // Detectar si el mouse está cerca del borde izquierdo del contenedor
      else if (e.clientX < rect.left + 40) {
        console.log('[IZQUIERDA]')
        if (scrollDirection !== 'left') {
          scrollDirection = 'left'
          clearInterval(scrollInterval)
          scrollInterval = setInterval(() => {
            kanbanContainer.scrollBy({ left: -150, behavior: 'smooth' })
          }, 400)
        }
      }
      // Si el mouse no está en los bordes, pero solo detén el scroll al salir por completo
      else {
        if (scrollDirection !== null) {
          console.log('[DETENIENDO]')
          clearInterval(scrollInterval)
          scrollInterval = null
          scrollDirection = null
        }
      }
    }

    dragula(kanbanColumns)
      .on('drag', (element, column) => {
        element.setAttribute('data-column', column.id)
        element.setAttribute('id', column.id)

        // [SCROLL AUTOMATICO]
        document.addEventListener('mousemove', handleAutoScroll)

        console.log(
          `[DRAG] Draggin <${element.tagName}> element by "${column.id}" column`
        )
      })
      .on('drop', (element, column) => {
        const columnId = column.id
        const id = element.id

        // [SCROLL AUTOMATICO]
        clearInterval(scrollInterval)
        document.removeEventListener('mousemove', handleAutoScroll)

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

        console.log(
          `[DROP] Dropped <${element.tagName}> element in "${column.id}" column`
        )
      })
      .on('over', (element, container) => {})
      .on('out', (element, container) => {})
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers, sleep } = await import(
      '../web-tools.js'
    )
    onDomReady(() => this.#init())
  }
}

function dragulaInit(containers) {}

window.customElements.define('kanban-board', KanbanBoardComponent)
