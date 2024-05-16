import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'

export class DeckReaderComponent extends DWCKComponent {
  #carousel
  #prevButton
  #nextButton

  path = import.meta.url
  template = './deck-reader.html'
  styles = ['./deck-reader.css']

  constructor() {
    super()

    this.addEventListener('componentReady', () => {
      this.#carousel = this.shadowRoot.querySelector('.card-scroll')
      this.#prevButton = this.shadowRoot.querySelector('.arrow-left')
      this.#nextButton = this.shadowRoot.querySelector('.arrow-right')
  
      this.#nextButton.addEventListener('click', (event) => this.next())
      this.#prevButton.addEventListener('click', (event) => this.prev())
    })
  }

  prev() {
    this.#carousel.scrollLeft -= this.#carousel.offsetWidth
  }

  next() {
    this.#carousel.scrollLeft += this.#carousel.offsetWidth
  }

  connectedCallback() {
    // registerTriggers(this, (event) => console.log(event))
  }

  disconnectedCallback() { }


  adoptedCallback() { }
}

window.customElements.define('deck-reader', DeckReaderComponent)
