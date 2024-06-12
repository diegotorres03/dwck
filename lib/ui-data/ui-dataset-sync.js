


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'

/**
 * take the detail of an event and make it data- attributes on the child elements
 *
 * @export
 * @class UIDatasetSyncComponent
 * @extends {HTMLElement}
 */
export class UIDatasetSyncComponent extends HTMLElement {

    constructor() {
        super()
        const template = html`<slot></slot>`
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template)
    }


    async connectedCallback() {
        const {onDomReady, registerTriggers} = await import('../web-tools')
        // mapComponentEvents(this)
        // updateVars(this)
        await onDomReady()
        registerTriggers(this, (event) => this.#syncData(event))
    }

    #syncData(event) {
        const children = Array.from(this.children)
        const data = {
            ...event.detail, 
            ...event.target.dataset, 
            value: event.target.value
        }
        
        console.log(event)
        console.log(data)
        console.log('children', children)
        if(!children) return 
        children.forEach(child => {
            console.log('child', child, data)
            Object.keys(data).forEach(key => {
                console.log('updating dataset', data, child, `data-${key}`, data[key])
                child.setAttribute(`data-${key}`, data[key])
            })
        })
    }

    disconnectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) { }

    adoptedCallback() { }

}

window.customElements.define('ui-dataset-sync', UIDatasetSyncComponent)
