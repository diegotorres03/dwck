/**
 * Creates idle time for a given period of time (in millisecotds).
 * Return a promise, use .then() or use async await
 *
 * @example
 * async funtion run() {
 *      console.log('starting function')
 *      await sleep()
 *      console.log('this will print after default time')
 * }
 *
 * @param {number} [time=300]
 * @returns {Promise}
 */
function sleep(time = 300) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// document.createElement('button').
function html(templates, ...values) {
  const template = document.createElement('template')
  let str = ''
  templates.forEach((template, index) => {
    str += template
    str = values[index] ? str + values[index] : str
  })
  if (str.match(/[^{}]*(?=\})/g)) {
    const regexRes = Array.from(str.matchAll(/[^{\}]+(?=})/g))
    regexRes.forEach(
      (key) =>
      (str = str.replace(
        `({${key}})`,
        `<span class="variable ${key}-var" data-key="${key}">${key}</span>`,
      )),
    )
  }
  // str = str.replace(/[^{}]*(?=\})/g, 'fuck yeah')
  template.innerHTML = str.trim()

  return template.content.cloneNode(true)
}

function mapComponentEvents(component) {
  const EVENT_NAMES = [
    'onclick',
    'ondblclick',
    'onabort',
    'onanimationcancel',
    'onauxclick',
    'onchange',
    'onclose',
    'onkeydown',
    'onkeyup',
    'onkeypress',
    'onload',
    'onmouseleave',
    'onmouseenter',
    'onmousemove',
    'onmouseover',
  ]
  // log(component)
  try {

    EVENT_NAMES.map((eventName) => {
      Array.from(component.shadowRoot.querySelectorAll(`[${eventName}]`)).forEach(
        (handled) => {
          const handlerName = handled.getAttribute(eventName)
          handled.addEventListener(eventName.replace('on', ''), (event) => {
            component[handlerName](event)
            updateVars(component)
          })
          handled.removeAttribute(eventName)
        },
      )
    })
  } catch (err) {
    console.log('el error es aca!')
    console.error(err)
  }
}

function updateVars(component) {
  const variables = Array.from(
    component.shadowRoot.querySelectorAll('.variable'),
  )
  variables.forEach((variable) =>
    Array.from(variable.classList)
      .filter((item) => item !== 'variable')
      .forEach((varName) => {
        const property = varName.replace('-var', '')
        variable.textContent = component[property]
      }),
  )
}

/**
 *
 *
 * @param {HTMLElement} component
 */
function renderForLoops(component) {
  const templates = Array.from(
    component.shadowRoot.querySelectorAll('template'),
  )
  templates.forEach((template) => console.log(template.dataset))
}

///// GraphQL
function gql(templates, ...values) {
  let str = ''
  templates.forEach((template, index) => {
    str += template
    str = values[index] ? str + values[index] : str
  })
  return str.trim()
}

/**
 * registrer triggers for an element
 * this is what enable the trigger="css_selector" and trigger-event="click"
 * on elements like <app-modal trigger="css_selector" and trigger-event="click">
 *
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function registerTriggers(element, callback) {
  if (!element.hasAttribute('trigger')) return
  const selector = element.getAttribute('trigger')
  console.log('selector', selector)
  if (!selector || selector === '#' || selector === '.') return

  const documentTriggers = Array.from(document.querySelectorAll(selector))
  const internalTriggers = Array.from(element.parentNode.querySelectorAll(selector))

  const triggers = [...documentTriggers, ...internalTriggers]

  if (!triggers) return
  let triggerEvent = element.getAttribute('on') || element.getAttribute('event')

  triggers.map((trigger) => {
    if (!triggerEvent) triggerEvent = trigger.DEFAULT_EVENT_NAME || 'click'
    // console.log('triggerEvent', triggerEvent, trigger)
    trigger.addEventListener(triggerEvent, callback)
    // trigger.removeEventListener()
  })


  function unregister() {
    triggers.map((trigger) => {
      if (!triggerEvent) triggerEvent = trigger.DEFAULT_EVENT_NAME || 'click'
      console.log('triggerEvent', triggerEvent, trigger)
      trigger.removeEventListener(triggerEvent, callback)
    })
  }

  // window.addEventListener('refresh-triggers', event => {
  //   console.log('refreshing triggers')
  //   window.removeEventListener('refresh-trigger', )
  // })


  return unregister
}

function select(selector, scope = document) {
  return scope.querySelector(selector)
}

function selectAll(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector))
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.ceil(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem(array) {
  const randomInt = getRandomInt(0, array.length - 1)
  const item = array.splice(randomInt, 1)
  return item.pop()
}



/**
 * take an element and an event, and match the event keys to the 
 * sub elements with a name attribute that match with a key on the event detail
 *
 * @param {HTMLElement} element
 * @param {CustomEvent} event
 */
function initializeValues(element, event) {
  const keysToUpdate = Object.keys(event.detail)
  console.log('initializing', event, element)
  console.log('initializing', keysToUpdate)
  // initializing the values
  keysToUpdate.forEach(key => {
    const items = [...element.querySelectorAll(`[name="${key}"]`)]
    items.forEach(item => {
      let field = item.getAttribute('data-field')
      const value = event.detail[key]
      if (field) return item.setAttribute(field, value)
      item.textContent = value
    })
  })
  
  // add all to data- properties
  keysToUpdate.forEach(key => {
    try {
      const mainElement = [...element.children].pop()
      const value = event.detail[key]
      const dataKey = `data-${key}`
      console.log('initializing ', dataKey, value)
      mainElement.setAttribute(dataKey, value)
    } catch{}
  })

}


/**
 * Call initFn if the dom is currently ready, or subscribe itself to the Dom ready event and then call the initFn
 *
 * @param {Function} initFn
 */
function onDomReady(initFn) {
  if (document.readyState === "complete") initFn()
  else document
    .addEventListener("DOMContentLoaded", () => initFn())
}


module.exports = {
  html,
  mapComponentEvents,
  renderForLoops,
  sleep,
  updateVars,
  gql,
  registerTriggers,
  select,
  selectAll,
  getRandomInt,
  getRandomItem,
  initializeValues,
  onDomReady,
}
