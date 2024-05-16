import { DWCKComponent } from '../dwck-component.js'

console.info('loading ace-editor comp')

export class AceEditorComponent extends DWCKComponent {

  static tag = 'ace-editor'

  path = import.meta.url
  template = './ace-editor.html'
  styles = ['./ace-editor.css']


  constructor() {
    super()
    // this.addEventListener('compoentReady', this.#init())
  }

  connectedCallback() {
    setTimeout(() => this.#init(), 10)
    // super.connectedCallback();
    // if(document.readyState) this.#init()
    // else this.addEventListener('compoentReady', this.#init())
  }

  async #init() {
    console.log('init')


    // await import('https://unpkg.com/ace-builds/src-noconflict/ace.js')
    // await import('https://unpkg.com/ace-builds/src-noconflict/mode-javascript.js')
    // await import('https://unpkg.com/ace-builds/src-noconflict/theme-monokai.js')

    await import('../../node_modules/ace-builds/src-noconflict/ace.js')
    await import('../../node_modules/ace-builds/src-noconflict/theme-monokai.js')
    // await import('../../node_modules/ace-builds/src-noconflict/mode-javascript.js')

    const ace = window.ace

    if (!ace) alert('ace not foud')


    console.log('ACE', ace)
    const editorContainer = this.shadowRoot.querySelector('#editor')

    console.log('editorContainer', editorContainer)

    const editor = ace.edit(editorContainer, {
      theme: "ace/theme/monokai",
      // theme: "ace/theme/dracula",
      autoScrollEditorIntoView: true,
      // useWorkers: true,
      // enableBasicAutocompletion: true, // the editor completes the statement when you hit Ctrl + Space
      // enableLiveAutocompletion: true, // the editor completes the statement while you are typing
      enableAutoIndent: true,
      // enableSnippets: true,
      dragEnabled: true,
    })
    console.log('editor', editor)

    // editor.session.setMode("ace/mode/javascript");



  }

}


window.customElements.define(AceEditorComponent.tag, AceEditorComponent)
