import { DWCKComponent } from '../dwck-component.js'
console.log('note card')



export class NoteCardComponent extends DWCKComponent {

  static tag = 'note-card'

  static get observedAttributes() { return ['name', 'editable'] }

  path = import.meta.url
  styles = ['./note-card.css']
  template = './note-card.html'

  // title = 'jajaja'
  set name(value) {
    console.log('setting name', value)
    // code to run once the attribute is set
  }

  get name() {
    return this.getAttribute('name')
  }

  set editable(value) {
    console.log('setting editable', value)
    if (value === null) return 'not editable'
    // console.log(Quill)
    this.#startEditor()
    this.title = 'editable'
    console.log(this.title)
  }



  #startEditor() {
    console.log(this.children)
    // const Quill = module.default
    console.log('quill', Quill)
    // this.#initQuill(Quill)

    const content = this.querySelector('[slot="main"]')
    console.log(`content`, content)
    if (!content) return
    // const content = this.querySelector('#content')
    // const toolbarOptions = ['bold', 'italic', 'underline', 'strike']
    const editor = new Quill(content, {
      theme: 'bubble',
      // theme: 'snow',
      modules: {
        // syntax: { hljs },
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          ['link', 'image', 'video',],
          ['clean']
        ]
      }
    })
    console.log('editor', editor)

    // use on, once and off

    editor.on('text-change', (delta, oldDelta, source) =>
      this.dispatch('text-change', { delta, oldDelta, source }))


    editor.on('selection-change', (range, oldRange, source) => {
      if (range) {
        if (range.length == 0) {
          console.log('User cursor is on', range.index);
        } else {
          const text = editor.getText(range.index, range.length);
          console.log('User has highlighted', text);
        }
      } else {
        console.log('Cursor not in the editor');
      }
      this.dispatch('selection-change', { range, oldRange, source })
    });


    editor.on('editor-change', (eventName, ...args) =>
      this.dispatch('editor-change', { eventName, args }))

    this.dispatch('editorReady')

  }


  constructor() {
    super()
    this.addEventListener('componentReady', () => this.updateVars())
  }


  async connectedCallback() {
    const webTools = await import('../web-tools.js')
    webTools.registerTriggers(this, event => this.process(event))
  }


  process(event) {
    console.log('processing', event)
  }


}

// export default function registerNoteCardComponent() {
//   window.customElements.define(NoteCardComponent.tag, NoteCardComponent)
// }
window.customElements.define(NoteCardComponent.tag, NoteCardComponent)

