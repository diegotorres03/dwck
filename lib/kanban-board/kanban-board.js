
import { DWCKComponent } from "../dwck-component.js"
import { KanbanColumnComponent } from "./kanban-column/kanban-column.js"

// import componentHtml from './kanban-board.html'
// import componentStyle from './deck-reader.css'
// import  from 'dragula'
// import dragula from '../../node_modules/dragula/dragula.js'

export class KanbanBoardComponent extends DWCKComponent {
	path = import.meta.url
	template = "./kanban-board.html"
	styles = ["./kanban-board.css"]


	static get observedAttributes() {
		return ["title"]
	}

	set title(value) {
		if (!value || value == '') return
		this.updateVars()
	}

	get title() {
		return this.getAttribute("title")
	}

	constructor() {
		super()

		// this.addEventListener('componentReady', () => mapComponentEvents(this))
	}

	async #init() {
		// const dragula = await import('../../node_modules/dragula/dist/dragula.js')
		const { dragula } = await import("../../builds/dragula.bundle.js")
		console.log("inside the kanban init", this.children)

		const kanbanColumns = [...this.querySelectorAll("kanban-column")]
		console.log(kanbanColumns)

		// [ ] add a time-in if none is present 

		/**
		 *
		 *
		 * @param { HTMLElement } task
		 */
		const setTimeIn = task => {
			console.log('task', task)
			if (task.hasAttribute('data-time-in')) return
			task.setAttribute('data-time-in', Date.now())
			console.log('time-in', task.getAttribute('data-time-in'))
		}

		// kanbanColumns.forEach(setTimeIn)

		dragula(kanbanColumns)
			.on("drag", (element, column) => {
				console.log("drag", element, column)
				element.setAttribute("data-column", column.id)
				element.setAttribute("column", column.id)
			})
			.on("drop", (element, column) => {
				const columnId = column.id
				const id = element.id
				console.log(
					"moving",
					id,
					"to column",
					columnId,
					element,
					column
				)

				const dropEvent = new CustomEvent(columnId, {
					bubbles: true,
					composed: true,
					detail: { id: id, column: columnId, _action: "drop", timestamp: Date.now() },
				})

				element.dispatchEvent(dropEvent)
				// this.dispatchEvent(dropEvent)

				// this will be the main event 
				const columnEvent = new CustomEvent("change", {
					bubbles: true,
					detail: { id: id, column: columnId, ...element.dataset, timestamp: Date.now()  },
				})

				setTimeout(() => {
					column.dispatchEvent(columnEvent)
				}, 1)

				// console.log("drop", element)
			})
			.on("over", (element, container) => {
				// console.log("over", element)
			})
			.on("out", (element, container) => {
				// console.log("out", element)
			})
	}

	async connectedCallback() {
		const { onDomReady, registerTriggers, sleep } = await import("../web-tools.js")
		onDomReady(() => this.#init())
		this.updateVars()

		// registerTriggers(this, event => this.addCard())

		await sleep(1000)
		this.updateVars()
		// dragula()
		// console.log('dragula')
		// console.log(dragula)
		// const kanbanColumns = [...this.querySelectorAll('kanban-column')]
		// console.log(kanbanColumns)
		// dragula(kanbanColumns)
	}
}

window.customElements.define("kanban-board", KanbanBoardComponent)
