import {
  html,
  mapComponentEvents,
  updateVars,
  registerTriggers,
  sleep,

} from '../web-tools.js'
import { DWCKComponent } from '../dwck-component.js'
import {} from './app-route.js'

export class RouterComponent extends DWCKComponent {
  get DEFAULT_EVENT_NAME() {
    return 'navigated'
  }

  template = html`
    <style>
      .hidden {
        display: none !important;
      }
    </style>
    <slot></slot>
  `;

  constructor() {
    super()
  }

  #evaluateGuard(route) {
    const guardId = this.getAttribute('guard');
    if (!guardId) return true;
    const guard = document.querySelector(`#${guardId}`);
    if (!gurad) throw new Error('guard function can`t be found!');
    gurd.run(
      new CustomEvent('routeGuard', { detail: route.getAttribute('hash') }),
    );
  }

  async #updateRoutes() {
    await Promise.resolve()
    const routes = Array.from(this.querySelectorAll('app-route'));
    // .filter(child => child.getAttribute('path') || child.getAttribute('hash'))
    const routeSet = new Set();
    routes.forEach((route) => routeSet.add(route));
    console.log(routeSet)
    console.log(routes)

    // if we hash is empty, look for the default route, the one without hash
    if (window.location.hash === '') {
      const homeRoute = routes.find((route) =>
        !route.hasAttribute('hash') || route.getAttribute('hash') === '')

      routes.forEach((route) => route.classList.add('hidden'));
      if (!homeRoute) return console.error('homeRoute not present')
      homeRoute.classList.remove('hidden');
      homeRoute.activated();
      // alert('home')
      return;
    }

    routes.forEach((route) => {
      route.classList.remove('hidden');
      route.activated();
    });

    routes
      .filter(
        (route) => !window.location.hash.includes(route.getAttribute('hash')),
      )
      .forEach((route) => route.classList.add('hidden'));

    routes
      .filter(
        (route) =>
          route.getAttribute('hash') &&
          !window.location.hash.includes(route.getAttribute('hash')),
      )
      .filter((route) => {
        // console.log(route, route.hasAttribute('hash'), window.location.hash)
        return !route.hasAttribute('hash') && window.location.hash === '';
      })
      .forEach((route) => {
        route.classList.add('hidden');
        routeSet.delete(route);
      });

    routeSet.forEach((route) => route.activated());
  }

  async connectedCallback() {
    // registerTriggers(this, (event) => console.log(event))
    await sleep(50)
    this.#updateRoutes()

    window.addEventListener('hashchange', (ev) => {
      console.info('hashchange')
      this.#updateRoutes();
      // const searchParms = new URLSearchParams(window.location.search)
      // console.log(searchParms.has('test'))
      this.shadowRoot.dispatchEvent(
        new CustomEvent(this.DEFAULT_EVENT_NAME, {
          bubbles: true,
          composed: true,
          detail: {
            hash: window.location.hash,
          },
        }),
      );
    });

    // function (event) {
    //   // url example 'https://domain.com/#hash?token=value'
    //   const hashPath = window.location.hash
    //   const [hash, token] = window.location.hash.split(/[\/]/g)
    //   const token = hashPath.split('token=').pop()
    //   return token ? { token } : null
    // }
  }

  disconnectedCallback() { }

  attributeChangedCallback(name, oldValue, newValue) { }

  adoptedCallback() { }
}

window.customElements.define('app-router', RouterComponent);
