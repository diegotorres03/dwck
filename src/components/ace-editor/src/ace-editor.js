import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../../../global/web-tools'

import ace from 'ace-code'
// import ace from 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.31.1/ace.js'
// import { Mode } from 'ace-code/src/mode/javascript'

// import 'ace-code/ext-language_tools'
// import 'ace-code/ace-extensions'
// import 'ace-code/ace-modes'
import * as jsSnippets from './snippets-js.json'

// import { getTypeAndDetailFromEvent } from '../../../tools'

/**
 *
 *
 * @export
 * @param { Event } event
 * @return {{type: string, detail: string}} 
 */
export function getTypeAndDetailFromEvent(event) {

  const type = event.data?.type || event.detail?.type
  const detail = event.data?.detail || event.detail?.detail || event?.detail?.data

  return { type, detail }

}

function removeSpacesAtBeginning(str, numSpaces) {
  const lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(new RegExp(`^ {${numSpaces}}`), '');
  }
  return lines.join("\n");
}

// https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts


import componentHtml from './ace-editor.html'
import componentStyle from './ace-editor.css'

export default class AceEditorComponent extends HTMLElement {

  static EVENT_NAMES = [
    'change',
    'changeSelection',
    'changeCursor',
  ]

  static get observedAttributes() {
    return ['language', 'value']
  }


  get language() {
    return this.getAttribute('language') || 'html'
  }

  textContent

  #editor
  /**
   *
   *  @param {HTMLIFrameElement.contentWindow}
   * @memberof AceEditorComponent
   */
  #iframeWindow
  constructor() {
    super()
    const editorId = '' + Date.now()

    /* #editor { 
      width: 100%;
      height: 200px;
      width: ${this.hasAttribute('width') ? this.getAttribute('width') : '100%'};
      height: ${this.hasAttribute('height') ? this.getAttribute('height') : '100%'};
    } */
    const template = html`
    ${componentHtml}
     
    `
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)

    const editorContainer = this.shadowRoot.querySelector('#editor')


    /**
     * any thing
     *
     * @param {*} param
     * @return {*} 
     */
    function test(param) {
      return true
    }


    const iframe = this.shadowRoot.querySelector('iframe')
    iframe.addEventListener('load', event => {
      console.log('load', event)
      this.#iframeWindow = iframe.contentWindow
      // this.#iframeWindow.postMessage('lang', this.getAttribute('language')||'javascript')
      console.log(this)
      console.log(this.innerHTML)
      console.log(this.shadowRoot.querySelector('ace-editor'))
      this.#iframeWindow.postMessage({
        type: 'content',
        value: this.innerHTML,
        id: editorId,
        snippets: {
          jsSnippets,
        }
      }, '*')
      // window.addEventListener('message', event => {
      //   console.log('x-(^.^)-x', event)
      // })


      this.shadowRoot.querySelector('#lang-select')
        .addEventListener('change', event => {
          const lang = event.target.value
          console.log('lang', lang)
          this.#iframeWindow.postMessage({ type: 'lang', value: lang, id: editorId }, '*')
        })
    })

    window.addEventListener('message', event => {
      const { type, detail } = getTypeAndDetailFromEvent(event)
      // console.log('event', event.data)
      if (type === 'ace-editor-changed' && detail?.id === editorId) {
        // console.log('ace-editor-changed', event.data.detail)
        this.value = detail?.value
      }
    })
    // window.addEventListener('ace-editor-changed', console.log)




    // iframe.addEventListener('message', event => {
    //   console.log('iframe message', event.detail)
    // })

    // setInterval(()=> {

    // }, 3000)


    this.#editor = ace.edit(editorContainer, {
      theme: "ace/theme/dracula",
      mode: `ace/mode/javascript`,
      // mode: `ace/mode/${this.language}`,
      // mode: Mode,

      value: this.textContent,
      // value: "<div>\n\thollow world!\n</div>\n<script><\/script>",
      // value: `
      // function test() {
      //   console.log('test')
      // }`,
      autoScrollEditorIntoView: true,
      useWorkers: true,
      enableBasicAutocompletion: true, // the editor completes the statement when you hit Ctrl + Space
      enableLiveAutocompletion: true, // the editor completes the statement while you are typing
    })

    // this.#editor.setOption('enableAutoIndent', true)
    // this.#editor.setOption('enableSnippets', true)
    // this.#editor.setOption('dragEnabled', true)

    this.#editor.renderer.attachToShadowRoot()
    // this.#editor.setTheme("ace/theme/monokai");
    // this.editor.session.setMode()

    // this.#editor.setOptions({
    //   // enableEmmet: true,
    //   useWorkers: true,
    //   // showPrintMargin: false, // hides the vertical limiting strip
    //   // maxLines: Infinity,
    //   // fontSize: "100%" // ensures that the editor fits in the environment

    // })

    // this.#editor.setValue('kaka')


  }


  connectedCallback() {
    mapComponentEvents(this)
    updateVars(this)
    registerTriggers(this, (event) => console.log(event))
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name)
    if (name === 'language') {
      // todo: validate new value
      const lang = newValue
      if (this.#iframeWindow)
        this.#iframeWindow.postMessage({ type: 'lang', value: lang })
    }

    if (name === 'value' && this.#iframeWindow) {
      console.log('value', newValue)
      try {

        this.#iframeWindow.postMessage({ type: 'content', value: '' })
      } catch (error) {
        console.log(error)
      }
    }
  }

  adoptedCallback() { }

}

window.customElements.define('ace-editor', AceEditorComponent)
