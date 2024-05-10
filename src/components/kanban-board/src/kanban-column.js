import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../../../global/web-tools';

import componentHtml from './kanban-column.html';
// import componentStyle from './simple-card.css';

export default class KanbanColumnComponent extends HTMLElement {

  get name() {
    return this.getAttribute('name') || this.id
  }

  constructor() {
    super();
    const template = html`<style>
      </style>
      <h3>({name})</h3>
      <slot></slot>
      `
      // ${componentHtml}
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)
  }

  #init() {
    Array.from(this.children)
      .forEach(child => child.setAttribute('data-column', this.id))
  }

  connectedCallback() {
    mapComponentEvents(this);
    updateVars(this);
    registerTriggers(this, (event) => console.log(event))

    onDomReady(() => this.#init())
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }
}

window.customElements.define('kanban-column', KanbanColumnComponent);
