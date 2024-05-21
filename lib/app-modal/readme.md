# AppModalComponent

Generic easy to use modal with a couple of data input functionallity

There are a couple of ways to open the modal

1. By registering triggers on the html tag
2. By adding the `open` attribute
3. By calling the `.show()` method

## Example
**1. Registering trigger**
```html
<button id="open-modal-btn">open</button>

<app-modal trigger="#open-modal-btn" on="click">
   <!-- modal content here -->
</app-modal>
```

## Slots

### Default

The content added inside the `app-modal` tags will be added to the defaul slot unless they have a `slot` attribute present.
The default slot represents the main content of the modal

### Title
Change the title of the modal

### Footer
This by default represent the `accept` and `decline` buttons, normally you don't change this unless other functionallity is required.


### Example for Slots

```html
<app-modal>
  <h3 slot="title">this will be the title</h3>
  <section>this will be on the content section of the modal</section>
</app-modal>
```


## Attributes

### open
if present the modal will open, if removed the modal will close

## Events

### Accepted

This event is fired when the user clicks the `accept` button (on the default footer slot)

if there are html inputs with a name, app-modal will thake those values and pass them in the `details` section of the event, the data attributes of the modal will be passed too inside the `details` section.

### Declined
Event fired when the user  clicks the `decline` button (on the default footer slot)


## Data handling
If you have inputs with name attributes, those will be extracted and send on the `accepted` event inside the `detail` property. Along with any `data-` attribute found on the `app-modal`.

```html
<app-modal data-extra="this is an extra value" trigger="#open-modal-btn" on="click">
   <section>
    <input type="text" name="username">
   </section>
</app-modal>

<script>
  document.querySelector('app-moda')
    .addEventListener('accepted', event=> {
      console.log(event.detail)
      /* { 
        username: 'what ever the user wrote',
        extra: 'this is an extra value'
      }
      */
    })
</script>

```



## Errors




