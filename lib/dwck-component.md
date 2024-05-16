# DWCKComponent

## Motivation
I want to be as native as possible, but for the sake of simplicity, I'm adding this class to be able to create web componets with less code, but at the end of the day, this will be native components.

## How to create a component

### using separate files for html and css

**plain-card.js** 
```js
import { DWCKComponent } from '../dwck-component.js'

export class PlainCardComponent extends DWCKComponent {
  static tag = 'plain-card'

  // this is annoying but important, when I learn a better way of doin it, I will do it
  path = import.meta.url // this will help set the http request right
  styles = ['./plain-card.css'] // relative path to css file
  template = './plain-card.html' // relative path to html file

  constructor() {
    super()
  }
}

window.customElements.define(PlainCardComponent.tag, PlainCardComponent)
```

### using html template and style tags from the document

first define the html and/or the css on the index.html

```html
...
<body>
  <template id="plain-card-template">
    <!-- html here... -->
  </template>
  <style id="plain-card-styles">
    /* css styles here */
  </style>
</body>
...
```

**plain-card.js** 
```js
import { DWCKComponent } from '../dwck-component.js'

export class PlainCardComponent extends DWCKComponent {
  static tag = 'plain-card'

  // this is annoying but important, when I learn a better way of doin it, I will do it
  styles = ['#plain-card-styles'] // id of the style element
  template = '#plain-card-template' // id of the template

  constructor() {
    super()
  }
}

window.customElements.define(PlainCardComponent.tag, PlainCardComponent)
```


### Using inline values

**plain-card.js** 
```js
import { DWCKComponent } from '../dwck-component.js'

export class PlainCardComponent extends DWCKComponent {
  static tag = 'plain-card'

  // this is annoying but important, when I learn a better way of doin it, I will do it
  
  // inline styles
  styles = [`    .card-container {
    border: 1px solid blue;
  }`]
  
  // inline template
  template = html`<div class="card-container">
  <div class="card-title">
      <slot name="title" >Title INLINE</slot>
  </div>
    
  <div class="card-content" >
      <slot name="main">Main</slot>
  </div>
  div>`

  constructor() {
    super()
  }
}

window.customElements.define(PlainCardComponent.tag, PlainCardComponent)
```

Note that you can combine all the methods, and for the styles, since is an array, you can use mix of styles at once

```js
  styles = [`    .card-container {
    border: 1px solid blue;
  }`, './plain-card.css']
```



## How to add observed attributes

for this we will use the standar procedure of defining wich attributes will be observed


### reacting to attribute changes

```js
export class PlainCardComponent extends DWCKComponent {
 
  static get observedAttributes() { return ['title', 'date'] }
}
```

The difference here, is how to listen to the changes, instead of calling the `attributeChangedCallback`, we only need to do a `set` to the properties we specified

```js
export class PlainCardComponent extends DWCKComponent {
 
  static get observedAttributes() { return ['title', 'date'] }

  set title() {
    // your code here
  }
  get title() { return this.getAttribute('title')}
}
```


### how to change attributes

Attributes can be changed either internally or externally

**Externally from html**
```html
<body>
  <plain-card title="this will trigger a change">
  </plain-card>
</body>
```

**Externally from js**
```js
  document.querySelector('plain-card')
    .setAttribute('title', 'this will also trigger a change')
```

**Internally from the web component**
```js
export class PlainCardComponent extends DWCKComponent {
  //...

  connectedCallback() {
    setTimeout(() => {
      this.setAttribute('title', 'this change is from inside')
    }, 2000);
  }
}
```


## How to emit events

A new method `dispatch` was added so it can be easily called.

```js
export class PlainCardComponent extends DWCKComponent {
  // ...
 connectedCallback() {
    setTimeout(() => {

      // just call the dispatch method
      // first is the event name, then the data
      this.dispatch('test', { test: 'test' })

    }, 2000);
  }
}
```


you can listen to this event like this

**From JS**
```js
document.querySelector('plain-card')
  .addEventListener('test', event => console.log(event))
```

**From Html**
```html
<plain-card></plain-card>

<app-modal trigger="plain-card" on="test">
</app-modal>

```
