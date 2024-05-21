
import { DWCKComponent } from "../dwck-component.js";


//import componentHtml from './flip-card.html'
//import componentStyle from './flip-card.css'


export class ServiceWorkerComponent extends DWCKComponent {


  #sw

  constructor() {
    super()
    console.log('creating service worker instance')
  }

  #registerWorker() {
    console.group('registering service worker')

    const cacheItems = Array.from(this.querySelectorAll('service-worker-cache'))

    const serviceWorkerCode = `
      console.log('this is the service worker')
      self.addEventListener('install', function(event) {
        event.waitUntil(
          caches.open('my-cache').then(function(cache) {
            return cache.addAll([
              ${cacheItems.map(cache => `'${cache.getAttribute('path')}'`).join(', ')}
            ]);
          })
        );
      });
    
      // Listen for the fetch event and return the cached asset, if available
      self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
          })
        );
      });
    
    `
    // console.log(serviceWorkerCode)

    if ('serviceWorker' in navigator) {
      // let url = URL.createObjectURL(new Blob([serviceWorkerCode], {type: 'application/javascript'}))

      const url = new URL('./sw.js', import.meta.url).href

      console.log(url)

      navigator.serviceWorker.register(url)
        .then(registration => {
          console.log('Service worker registered successfully!');
          this.#sw = registration.active
          const pathsToCache = cacheItems.map(cache => cache.getAttribute('path'))
          console.log('cache items', pathsToCache)

          this.#sw.postMessage({ type: 'cache', paths: pathsToCache })
          registration.active.addEventListener('message', event => {
            console.log('message received', event.data)
          })
        })
        .catch(error => {
          // console.log('Service worker registration failed:', error);
          console.error( error);
        });
    }


    console.groupEnd('registering service worker')

  }


  async connectedCallback() {
    const { onDomReady, registerTriggers } = await import('../web-tools.js')
    await onDomReady(() => console.log('seems ready here'))
    registerTriggers(this, (event) => console.log(event))
    this.#registerWorker()
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }

}

window.customElements.define('service-worker', ServiceWorkerComponent)


