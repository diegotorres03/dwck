import {
	html,
	mapComponentEvents,
	updateVars,
	registerTriggers,
	onDomReady,
} from "../web-tools.js";
import { DWCKComponent } from "../dwck-component.js";

export class SimpleCardComponent extends DWCKComponent {
	path = import.meta.url;
	template = "./simple-card.html";
	styles = ["./simple-card.css"];

	constructor() {
		super();
	}

	connectedCallback() {
		onDomReady(() => registerTriggers(this, (event) => console.log(event)));
	}

	disconnectedCallback() {}
	attributeChangedCallback(name, oldValue, newValue) {}

	adoptedCallback() {}
}

window.customElements.define("simple-card", SimpleCardComponent);
