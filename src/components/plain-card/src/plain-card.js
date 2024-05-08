import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
} from '../../../global/web-tools'

import plainCardHtml from './plain-card.html'
import plainCardStyle from './plain-card.css'


import { Converter } from 'showdown'
import TurndownService from 'turndown'
import { marked } from 'marked'
import Quill from 'quill'
import hljs from 'highlight.js'

const mdHeadingsToHtml = text => {
  console.log(text)

  // Markdown to HTML
  text = text.replace(/^\[ \](.*)$/gm, '<li><input type="checkbox"> $1</li>');
  console.log(text)

  // HTML to Markdown  
  // text = text.replace(/<li><input type="checkbox"> (.*)<\/li>/g, '- [ ] $1');

  // const headingRegex = /^(#+)\s+(.+)$/gm;
  // const matches = text.replace(/<br>/g, '\n').match(headingRegex) || []
  // console.log(matches)

  // matches.forEach(match => {
  //   console.log(match)
  //   // const [, hashCount, headingText] = match.match(headingRegex);
  //   // const headingLevel = hashCount.length;
  //   // console.log(`Heading level: h${headingLevel}, Text: ${headingText}`);
  // });

}


const showdown = new Converter()
const turndown = new TurndownService()
// const toHtml = text => showdown.makeHtml(text)
const toHtml = text => {
  // mdHeadingsToHtml(text)
  return marked.parse(text)
}
const toMd = text => {
  console.log(text)

  // HTML to Markdown  
  text = text.replace(/<input type="checkbox"> (.*)/g, '- [ ] $1');
  console.log('==>', text)
  let mdText = turndown.turndown(text)
  console.log(mdText)
  return mdText
}

const toMdX = content => {
  // replace checkboxed
  const checkboxes = [...content.querySelectorAll('input[type="checkbox"]')]
  checkboxes.forEach(checkbox => {
    // checkbox.parentElement.innerHTML = checkbox.parentElement.innerHTML.replace('<input type="checkbox"> ', '[ ] ')
    console.log(checkbox)
    console.log(checkbox.checked)
    console.log(checkbox.parentElement.innerHTML)
    // checkbox.innerHTML = `[${checkbox.checked ? ' ' : 'x'}] `
    // console.log(checkbox.parentElement.innerHTML)
    // checkbox.remove();
    checkbox.outerHTML = `&#91;${!checkbox.checked ? ' ' : 'x'}&#93; `
    // checkbox.nextSibling.textContent = `[${checkbox.checked ? ' ' : 'x'}] `
  })
  console.log(content.innerHTML)
  const res = turndown.turndown(content.innerHTML)

  console.log('res.asd')
  console.log(res)
  // return res
  return res.replace(/\\/g, '')

  // replace headers
  // replace bold
  // replace crossed
  // replace underscre
  // replace code blocks
  // replace tables

}


export default class PlainCardComponent extends HTMLElement {

  get htmlContent() {
    return this.querySelector('[slot="main"]').innerHTML
  }

  get codeModal() {
    return this.querySelector('#')
  }

  constructor() {
    super()
    const template = html`<style>
        ${plainCardStyle}
      </style>
      ${plainCardHtml}`
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template)
    this.isEditable = false
  }

  connectedCallback() {
    mapComponentEvents(this)
    updateVars(this)
    registerTriggers(this, (event) => console.log(event))

    this.querySelector('[slot="title"]')?.setAttribute('contenteditable', true)

    if(!this.hasAttribute('editable')) return
    
    const content = this.querySelector('[slot="main"]')
    if(!content) return
    // const content = this.querySelector('#content')
    console.log(content)
    const editor = new Quill(content, {
      theme: 'bubble',
      modules: {
        syntax: { hljs },
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          ['link', 'image', 'video',], // 'formula'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
          // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          // [{ 'direction': 'rtl' }],                         // text direction

          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          // [{ 'align': [] }],

          // ['clean']                                         // remove formatting button
        ]



      }
    })
    console.log('editor', editor)

  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }
}

window.customElements.define('plain-card', PlainCardComponent)
