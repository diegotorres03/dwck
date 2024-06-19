import { DWCKComponent } from '../../dwck-component.js'

export class LandingHeaderComponent extends DWCKComponent {
  
  // Retornar atributos que serán observados (propensos a cambiar)
  static get observedAttributes() {
    return ['title', 'subtitle', 'logo']
  }

  path = import.meta.url;
  template = "./landing-header.html";
  styles = ["./landing-header.css"];


  set title(value) {
    this.updateVars()
  }

  get title() {
    return this.getAttribute('title')
  }

  set subtitle(value) {
    this.updateVars()
  }

  get subtitle() {
    return this.getAttribute('subtitle')
  }

  set logo(value) {
    this.shadowRoot.querySelector('#logo')?.setAttribute('src', value)
  }

  get logo() {
    return this.getAttribute('logo')
  }

  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, sleep, } = await import('../../web-tools.js')
    await onDomReady()
    await sleep(100) // WHY?????
    this.updateVars()

    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));

    // const title = this.getAttribute('title');

    const elements = Array.from(this.querySelectorAll('a'));

    const listItems = elements.map((element) => {
      const li = document.createElement('li');
      li.classList.add('landing-header__nav-list-item');
      li.appendChild(element);

      return li;
    });

    listItems.forEach((element) => {
      this.appendChild(element);
    });

    const navMenu = this.shadowRoot.querySelector('#nav-list');
    const dropdownBtn = this.shadowRoot.querySelector('#dropdown-btn');

    dropdownBtn?.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
    });
  }

  disconnectedCallback() { }



  adoptedCallback() { }
}

window.customElements.define('landing-header', LandingHeaderComponent);
