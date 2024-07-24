import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../web-tools.js';
import { DWCKComponent } from '../dwck-component.js'

export class RouteComponent extends DWCKComponent {
  get DEFAULT_EVENT_NAME() {
    return 'activated';
  }

  static get observedAttributes() {
    return ['guard'];
  }

  constructor() {
    super();
    this.addEventListener('componentReady', () => mapComponentEvents(this))

  }

  async connectedCallback() {
    onDomReady(() => registerTriggers(this, () => this.activate()))

    if (!this.getAttribute('src')) return;

    const src = this.getAttribute('src');
    // console.log(src)

    const rawHtml = await (await fetch(src)).text();
    // console.log(rawHtml)
    this.appendChild(html`${rawHtml}`);
  }

  disconnectedCallback() { }

  adoptedCallback() { }

  activate() {
    window.location.hash = this.getAttribute('hash') || '';
  }

  activated() {
    const componetHash = this.getAttribute('hash') || '';
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== componetHash) return console.log("[app-route] return: ", currentHash, componetHash)

    const event = new CustomEvent(this.DEFAULT_EVENT_NAME, {
      bubbles: true,
      composed: true,
      detail: {
        route: currentHash,
      },
    });
    const srcSelector = `[href="#${componetHash}"]`;
    const srcElement = document.querySelector(srcSelector);
    this.dispatchEvent(event);
    if (!srcElement) {
      return;
    }

    document.querySelectorAll("a").forEach(a => {
      if (a.classList.contains("active-route")){
        a.classList.remove("active-route")
      }
    });

    srcElement.classList.add('active-route');
  }
}

window.customElements.define('app-route', RouteComponent);
