import {
	html,
	mapComponentEvents,
	updateVars,
	registerTriggers,
	onDomReady,
} from "../web-tools.js";
import { DWCKComponent } from "../dwck-component.js";

export class HeaderCardComponent extends DWCKComponent {
	path = import.meta.url;
	template = "./header-card.html";
	styles = ["./header-card.css"];

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

window.customElements.define("header-card", HeaderCardComponent);
