import { DWCKComponent } from '../../dwck-component.js'

export class LandingHeaderComponent extends DWCKComponent {
  // Retornar atributos que serán observados (propensos a cambiar)
  static get observedAttributes() {
    return ['title', 'subtitle', 'logo']
  }

  path = import.meta.url
  template = './landing-header.html'
  styles = ['./landing-header.css']

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
    console.log('[SETLOGO]', value)
    setTimeout(() => {
      this.shadowRoot.querySelector('#logo')?.setAttribute('src', value)
    }, 100)
  }

  get logo() {
    return this.getAttribute('logo')
    // return this.shadowRoot.querySelector('#logo')?.getAttribute('src')
  }

  constructor() {
    super()
  }

  async connectedCallback() {
    const { onDomReady, sleep } = await import('../../web-tools.js')
    await onDomReady()
    this.updateVars()

    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));

    // Transformar "a" a "li > a"
    const elements = Array.from(this.querySelectorAll('a'))
    const listItems = elements.map(element => {
      const li = document.createElement('li')
      li.classList.add('landing-header__nav-list-item')
      li.appendChild(element)
      return li
    })
    listItems.forEach(element => {
      this.appendChild(element)
    })

    // [ ] Resolver esto
    setTimeout(() => {
      const navMenu = this.shadowRoot.querySelector('#nav-list')
      const dropdownBtn = this.shadowRoot.querySelector('#dropdown-btn')

      dropdownBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('hidden')
      })
    }, 300)
  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

window.customElements.define('landing-header', LandingHeaderComponent)
