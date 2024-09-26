import { DWCKComponent } from '../dwck-component.js'

export class DwckWelcomeComponent extends DWCKComponent {
  path = import.meta.url
  template = './dwck-welcome.html'
  styles = ['./dwck-welcome.css']

  constructor() {
    super()
    this.addEventListener('componentReady', async () => {
      const versionSpan = this.shadowRoot.querySelector('#version')
      versionSpan.innerText = await this.getProjectVersion()

      this.addThemeEvent()
    })
  }

  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    onDomReady(() => registerTriggers(this, event => console.log(event)))
  }

  // Añadir los eventos de cambio de tema
  addThemeEvent() {
    const htmlRoot = document.documentElement
    const themeToggler = this.shadowRoot.querySelector('#theme-toggler')
    const background = this.shadowRoot.querySelector('.welcome')

    const changeBgColor = () => {
      background.className = htmlRoot.classList.contains('dark')
        ? 'welcome dark'
        : 'welcome'
    }

    // Registrar el evento 'click' en el botón theme-toggler
    themeToggler.addEventListener('click', () => {
      htmlRoot.classList.toggle('dark')
      changeBgColor()
    })
  }

  async getProjectVersion() {
    try {
      // Hacer una petición HTTP para obtener el archivo package.json
      const response = await fetch('../../package.json')
      const packageJson = await response.json()

      // Obtener la versión
      const projectVersion = packageJson.version
      return projectVersion
    } catch (err) {
      console.error('Error al obtener el archivo package.json:', err)
    }
  }
}

window.customElements.define('dwck-welcome', DwckWelcomeComponent)
