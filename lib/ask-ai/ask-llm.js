import { DWCKComponent } from '../dwck-component.js'
import { EmitEventComponent } from "./emit-event.js";

export class AskLLMComponent extends DWCKComponent {


  path = import.meta.url
  // template = './ask-llm.html'

  constructor() {
    super()
  }



  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    console.log('ask-llm ready')
    registerTriggers(this, async (event) => {
      console.log('event', event)
      // const message = this.textContent

      // get sources
      const sources = [...this.querySelectorAll('source')]
      console.log('sources', sources)

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      }

      // adding external sources to the doc
      const context = await Promise.all(sources.map(source => {
        const src = source.getAttribute('src')
        if(src.startsWith('http')) {
          // [ ] cors error here
          return fetch(src, corsHeaders).then(res => res.text())
        } else {
          return Promise.resolve(document.querySelector(src)?.textContent || '') 
        }
      }))

      // adding the rest of the html to the context
      context.push(this.innerHTML)

      console.log('context', context)

      let message = context.join('\n')
      console.log('context', message)
      const prompt = event.prompt || ''
      message += '\n' + prompt
      const promptWraper = document.createElement('section')
      promptWraper.innerHTML = prompt
      promptWraper.setAttribute('data-sender', 'user')
      promptWraper.setAttribute('contenteditable', '')
      const model = this.getAttribute('model')
      
      console.table({message, model})
      this.dispatch('prompt', { prompt: message, model })

    })
  }

  async ask() {
    const {
      InvokeModelCommand,
      BedrockRuntimeClient,
    } = await import('../../builds/dist/main.js')

    const client = new BedrockRuntimeClient({})
    const command = new InvokeModelCommand({
      modelId: versionMap[options.version] || 'anthropic.claude-instant-v1',
      accept: '*/*',
      contentType: 'application/json',
      body: JSON.stringify({
        prompt,
        max_tokens_to_sample: 3000,
        temperature: 0.5,
        top_k: 250,
        top_p: 1,
      })
    })


    const response = await client.send(command).catch(err => {
      console.log('bedrock error')
      console.error(err)
      throw err
    })
    const textResponse = JSON.parse(Buffer.from(response.body, 'base64').toString('utf8')).completion
    // console.log('RESPONSE:', textResponse)
    this.dispatch('llm-response', { message: textResponse })
    return textResponse.trim()


  }
}

window.customElements.define('ask-llm', AskLLMComponent)

