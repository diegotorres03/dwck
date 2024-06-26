


export class EmitEventComponent extends HTMLElement {


  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
  }

  connectedCallback() {
    console.log(this.dataset)
    const event = new CustomEvent(this.getAttribute('name'), {
      detail: { ...this.dataset }, composed: true, bubbles: true
    })

    console.log('event', event)

    this.dispatchEvent(event)

  }


}


window.customElements.define('emit-event', EmitEventComponent)
