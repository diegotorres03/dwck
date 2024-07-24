import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  onDomReady,
} from '../web-tools.js';
import { DWCKComponent } from '../dwck-component.js'

export default class AppLayoutComponent extends DWCKComponent {
  static get observedAttributes() {
    return ['hide-left'];
  }

  path = import.meta.url
  template = './app-layout.html';
  styles = ['./app-layout.css']

  // [ ] Revisar si todavía es necesario
  get isHidden() {
    //
    return (
      this.shadowRoot.querySelector('[data-left-content-hide]').style
        .display === 'none'
    );
  }

  constructor() {
    super();
    this.addEventListener('componentReady', () => {
      this.setupResize();
    })
  }

  // 15-08-23
  // showLeftContent() {
  //   const leftContent = this.shadowRoot.querySelector(
  //     '[data-left-content-hide]',
  //   );
  //   leftContent.style.display = 'flex';
  // }

  // hideLeftContent() {
  //   const leftContent = this.shadowRoot.querySelector(
  //     '[data-left-content-hide]',
  //   );
  //   leftContent.style.display = 'none';
  //   console.log('leftContent', leftContent);
  // }

  setupResize() {
    // this.querySelector || this.shadowRoot....
    // Seleccionar los elementos del DOM
    const resizerElement = this.shadowRoot.querySelector('#resizer');
    const sideBarElement = this.shadowRoot.querySelector('#side-bar');
    const toggle = this.shadowRoot.querySelector('#hidder-btn');

    // Función para inicializar el redimensionamiento
    const initializeResizer = (resizerElement, sideBarElement) => {
      let initialMouseX, initialWidth;
      // Controlador de evento 'mousedown'
      const handleMouseDown = (event) => {
        // Almacenar la posición inicial del mouse en initialMouseX
        initialMouseX = event.clientX;

        // Obtener el ancho actual de la barra lateral
        const sidebarWidth = window.getComputedStyle(sideBarElement).width;
        initialWidth = parseInt(sidebarWidth, 10);

        // Agregar listeners para los eventos 'mousemove' y 'mouseup'
        this.shadowRoot.addEventListener('mousemove', handleMouseMove);
        this.shadowRoot.addEventListener('mouseup', handleMouseUp);
      };

      // Controlador de evento 'mousemove'
      const handleMouseMove = (event) => {
        // Calcular el movimiento del mouse en el eje X
        const mouseMovementX = event.clientX - initialMouseX;

        // Calcular el nuevo ancho de la barra lateral
        const newWidth = initialWidth + mouseMovementX;

        // Limitar el ancho mínimo de la barra lateral a 700px
        if (newWidth >= 50) {
          sideBarElement.classList.remove('hidden');
          sideBarElement.style.width = `${newWidth}px`;
        } else {
          sideBarElement.classList.add('hidden');
        }
      };

      // Controlador de evento 'mouseup'
      const handleMouseUp = () => {
        // Eliminar los listeners de los eventos 'mousemove' y 'mouseup'
        this.shadowRoot.removeEventListener('mousemove', handleMouseMove);
        this.shadowRoot.removeEventListener('mouseup', handleMouseUp);
      };

      // Agregar el listener 'mousedown' al elemento resizer
      resizerElement.addEventListener('mousedown', handleMouseDown);

      toggle.addEventListener('click', function () {
        sideBarElement.classList.toggle('hidden');
      });
    };

    // Inicializar el redimensionamiento de la barra lateral
    initializeResizer(resizerElement, sideBarElement);
  }

  connectedCallback() {
    // mapComponentEvents(this);
    // updateVars(this);
    // registerTriggers(this, (event) => console.log(event));

    onDomReady(() => {
      console.log(this.children)
      // const children = Array.from(this.children)
      const slots = ['header', 'footer', 'main', 'menu']

      slots.forEach(slotName => this.querySelector(slotName)?.setAttribute('slot', slotName))
      
      const leftContent = this.querySelector('[slot="left-content"]');
      console.log('leftContent', leftContent);
      if (leftContent && leftContent.hasAttribute('hide-left')) {
        this.hideLeftContent();
      }
    })
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(name, oldValue, newValue)
    if (name === 'hide-left') {
      console.log('hide-left', newValue);
      if (newValue === null) this.hideLeftContent();
      else this.showLeftContent();
    }
  }

  adoptedCallback() { }
}

window.customElements.define('app-layout', AppLayoutComponent);
