import { DWCKComponent } from '../dwck-component.js'


export class AskLLMComponent extends DWCKComponent {


  path = import.meta.url

  constructor() {
    super()
  }



  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady()
    console.log('ask-llm ready')
    registerTriggers(this, async (event) => {
      console.log('event', event)
      const message = this.textContent
      const model = this.getAttribute('model')
      // this.ask()
      const mods = await import('../../builds/dist/main.js')
      console.log('mods', {...mods})
      // const response = await askClaude(message)

      // console.log('prompt', message)
      // const targetSelector = this.getAttribute('target')
      // const target = document.querySelector(targetSelector) || this.shadowRoot.querySelector(targetSelector)

      // console.log(response)

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

