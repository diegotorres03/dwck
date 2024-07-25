import { DWCKComponent } from '../dwck-component.js'
import { EmitEventComponent } from "./emit-event.js";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
}


export class AskLLMComponent extends DWCKComponent {


  path = import.meta.url
  // template = './ask-llm.html'

  contextMap = new WeakMap()

  constructor() {
    super()
  }



  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    console.log('ask-llm ready')

    registerTriggers(this, event => this.handleEvent(event))

    // registerTriggers(this, async (event) => {
    //   console.log('event', event)
    //   // const message = this.textContent

    //   // get sources
    const sources = [...this.querySelectorAll('source')]
    console.log('sources', sources)


    // adding external sources to the doc

    sources.map(async source => {
      const src = source.getAttribute('src')
      source.setAttribute('read', '')
      if (src.startsWith('http') || src.startsWith('./') || src.startsWith('../')) {
        // [ ] cors error here
        fetch(src, corsHeaders).then(res => res.text())
          .then(res => this.contextMap.set(source, res))
      } else {
        const localRes = document.querySelector(src)?.textContent || ''
        this.contextMap.set(source, localRes)
      }
    })

    console.log('contextMap', this.contextMap)



    //   // [ ] create the messages format, this will eventually help to include images in the conversation


    //   const systemMessage = {
    //     role: 'system',
    //     content: context.map(item => ({
    //       text: item
    //     })) || []
    //   }
    //   const messages = [systemMessage]

    //   // [ ] add context first

    //   // [ ] add user and assistant messages in order 

    //   return
    //   // adding the rest of the html to the context
    //   context.push(this.innerHTML)

    //   let message = context.join('\n')
    //   console.log('context', message)
    //   const prompt = event.prompt || ''
    //   message += '\n' + prompt
    //   const promptWraper = document.createElement('section')
    //   promptWraper.innerHTML = prompt
    //   promptWraper.setAttribute('data-sender', 'user')
    //   promptWraper.setAttribute('contenteditable', '')
    //   const model = this.getAttribute('model')

    //   console.table({ message, model })
    //   this.dispatch('prompt', { prompt: message, model })

    // })
  }

  async handleEvent(event) {

    console.log('handling event', event)

    const userPrompt = event.detail.prompt

    console.log('Event to LLM', event.detail)


    const section = document.createElement('section')
    section.setAttribute('role', 'user')
    if(typeof userPrompt === 'object') {
      // alert('is an object')
      section.appendChild(userPrompt)
    } else {
      const paragraph = document.createElement('p')
      paragraph.textContent = userPrompt
      section.appendChild(paragraph)
    }
    this.appendChild(section)

    const children = [...this.children]
    console.log('children', children)
    const messages = children
      .filter(child => child.hasAttribute('role'))
      .map(child => {
        const messageItem = {
          role: child.getAttribute('role'),
          content: [...child.children]
            .map(item => {
              // console.log(item.tagName)
              if (item.tagName === 'SOURCE') {
                const article = document.createElement('article')
                const src = item.getAttribute('src')
                article.setAttribute('src', src)
                // add the content
                const content = this.contextMap.get(item)
                // article.innerText = content
                // console.log("CONTENT:", article)
                return { text: content }
              }
              if (item.tagName === 'IMG') {
                // alert(item.getAttribute('src'))
                const encodedImage = '' // get base64 encoding for, remote image
                function getBase64Image(imgElem) {
                  // Create an empty canvas element
                  const canvas = document.createElement("canvas");
                  canvas.width = imgElem.width;
                  canvas.height = imgElem.height;

                  // Copy the image contents to the canvas
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(imgElem, 0, 0);

                  // Get the data-URL formatted image
                  // Mozilla has a default type cross-browser of png
                  const dataURL = canvas.toDataURL("image/png");

                  return dataURL;
                }

                // Usage example
                const imgElement = item
                const base64Image = getBase64Image(imgElement);
                console.log(base64Image); // Outputs the base64 string of the image
                // alert(base64Image)
                return {
                  type: 'image', 
                  source: {
                    type: 'base64',
                    data: base64Image.split('base64,').pop(),
                    media_type: 'image/png',
                  }
                }
              }
              return { text: item.innerHTML, type: 'text' }
            })
            .filter(item => item.text !== '' || item.type === 'image')
        }
        // console.log(child)
        // console.log(child.tagName)
        // console.log(child.innerHTML)
        console.log('messageItem', messageItem)
        return messageItem
      })

    console.log('messages', messages)

    const model = this.getAttribute('model')

    console.table({ messages, model })
    // this.dispatch('prompt', { prompt: JSON.stringify(messages), model })
    this.dispatch('prompt', { prompt: messages, model })


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

