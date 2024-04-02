import mermaid from 'mermaid'
// import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

import {
  html,
  mapComponentEvents,
  updateVars,
  sleep,
  registerTriggers,
} from '../../global/web-tools'



class MermaidViewerComponent extends HTMLElement {

  mermaid
  constructor() {
    super()

    const template = html`<pre><slot class="mermaid"></slot></pre>
        
        <!-- <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"></script> -->
        `
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

    const mermaidContainer = this.shadowRoot.querySelector('.mermaid')
    console.log(mermaidContainer)
    mermaid.initialize({ startOnLoad: true })
    const mermaidCode = this.textContent
    console.log(mermaidCode)

    // mermaid.render('test', mermaidCode, mermaidContainer)
    // mermaid.initialize({ startOnLoad: true })
  }



  connectedCallback() { }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('mermaid-viewer', MermaidViewerComponent)
