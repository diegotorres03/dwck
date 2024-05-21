
import { DWCKComponent } from "../dwck-component.js";

export class SimpleCardComponent extends DWCKComponent {

	path = import.meta.url;
	template = "./simple-card.html"
	styles = ["./simple-card.css"]

	constructor() {
		super();
	}

	async connectedCallback() {
		const { onDomReady, registerTriggers } = await import("../web-tools.js");
		onDomReady(() => registerTriggers(this, (event) => console.log(event)));
	}

}

window.customElements.define("simple-card", SimpleCardComponent);
