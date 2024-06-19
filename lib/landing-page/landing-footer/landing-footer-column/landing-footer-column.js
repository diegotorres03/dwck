
import { DWCKComponent } from '../../../dwck-component.js'


export class LandingFooterColumn extends DWCKComponent {
  static get observedAttributes() {
    return ['title'];
  }


  path = import.meta.url;
  template = "./landing-footer-column.html";
  styles = ["./landing-footer-column.css"];


  set title(value) {
    this.updateVars()
  }

  get title() {
    return this.getAttribute('title')
  }


  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, sleep } = await import('../../../web-tools.js')
    await onDomReady()

    await sleep(500)
    this.updateVars()

    const elements = Array.from(this.querySelectorAll('p'));
    // console.log(':D', elements);

    const listItems = elements.map((element) => {
      const li = document.createElement('li');
      li.appendChild(element);
      // console.log(element.textContent);

      return li;
    });

    listItems.forEach((element) => {
      this.appendChild(element);
    })

  }

  disconnectedCallback() { }

  adoptedCallback() { }
}

window.customElements.define('landing-footer-column', LandingFooterColumn);
