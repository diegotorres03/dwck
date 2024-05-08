import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../../../global/web-tools';

import componentHtml from './kanban-column.html';
// import componentStyle from './simple-card.css';

export default class KanbanColumnComponent extends HTMLElement {

  get name() {
    return this.getAttribute('name')
  }

  constructor() {
    super();
    const template = html` <style>
        
      </style>
      ${componentHtml}`;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template);
  }

  connectedCallback() {
    mapComponentEvents(this);
    updateVars(this);
    registerTriggers(this, (event) => console.log(event));
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}

  adoptedCallback() {}
}

window.customElements.define('kanban-column', KanbanColumnComponent);
