import { DWCKComponent } from "../dwck-component.js";

export class ChatModalComponent extends DWCKComponent {
	path = import.meta.url;
	template = "./chat-modal.html";
	styles = ["./chat-modal.css"];

	constructor() {
		super();
	}

	async connectedCallback() {
		const { onDomReady, registerTriggers } = await import(
			"../web-tools.js"
		);
		onDomReady(() => registerTriggers(this, (event) => console.log(event)));
	}
}

window.customElements.define("chat-modal", ChatModalComponent);
