import { html } from "../../web-tools.js";
import { DWCKComponent } from "../../dwck-component.js";

// import componentStyle from './simple-card.css';

export class KanbanColumnComponent extends DWCKComponent {
	path = import.meta.url;
	template = "./kanban-column.html";
	styles = ["./kanban-column.css"];

	static get observedAttributes() {
		return ["name"];
	}

	set name(value) {
		// this.update()
		console.log("setting value");
		this.updateVars();
	}

	get name() {
		return this.getAttribute("name") || this.id;
	}

	constructor() {
		super();
		// this.addEventListener('componentReady', () => mapComponentEvents(this))
	}

	#init() {
		Array.from(this.children).forEach((child) =>
			child.setAttribute("data-column", this.id)
		);
	}

	async connectedCallback() {
		const { onDomReady, registerTriggers } = await import(
			"../../web-tools.js"
		);
		await onDomReady();
		registerTriggers(this, (event) => console.log(event));
		this.#init();
		this.updateVars();
	}
}

window.customElements.define("kanban-column", KanbanColumnComponent);
