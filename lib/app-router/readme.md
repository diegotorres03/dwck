# AppRouterComponent 

This component is used to provide navigation to a web page by mapping the `hash` part of the URL with a matching `AppRouteComponent`


## Events

When navigation happens, a `navigated` event will be triggered, the new hash will be passed inside the details section of the event

```js
document.querySelector('app-router')
  .addEventListener('navigated', event => {
    const { hash } = event.detail
    console.log(hash)
  })
```

## Example

```html

<nav>
    <a href="#">Home</a>
    <br>
    <a href="#other">Other</a>
    <br>
    <a href="#other/sub1">Other/Sub1</a>
    <br>
    <a href="#other/sub2">Other/Sub2</a>
</nav>

<app-router>
  <app-route>
        <!-- http://localhost:8080 -->
        <!-- http://localhost:8080/# -->
        This is de default route. It will be displayed when the url don't have a hash or has an empty hash `#`
      </app-route>

      <app-route hash="other">
        <!-- http://localhost:8080/#other -->
        this will be displayed when the hash part of the url starts with `other` wich means it can match more than one route
      </app-route>

      <app-route hash="other/sub1">
        <!-- http://localhost:8080/#other/sub1 -->
        this will render in addition to the "#other" route
      </app-route>


      <app-route hash="other/sub2">
        <!-- http://localhost:8080/#other/sub2 -->
        this will render in addition to the "#other" router`
      </app-route>

</app-router>

```



# AppRouteComponent

Represent an individual route.


## Properties

### hash
All `app-route` have a `hash` property, exept the empty or default route. This hash property will match the hash part of the url, if the url-hash contains the value of the hash property, the route will activate and will emit the `activated` event


## Events

### activated
This event is emmited everytime a route is activated, in other words, when navigation happenes and a route selected, that app-route compoent will emit this event to let other components know about the change in UI


## Example

```html

<app-router>
  <app-route id="test-route" hash="test">
    <!-- content here -->
  </app-route>
</app-router>

<script>
  // this listener will be trigger when a navigation to #test happens
  document.querySelector('#test-route')
    .addEventListener('activated', event => {
      console.log('event')
    })
</script>

```
