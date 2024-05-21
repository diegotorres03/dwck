# HttpRequestComponent

This web component provides an easy to use approach to make http requests.
If using html as the response, a `target` attribute with the css selector of a container can be used to automatically insert the response inside the target container.



## Events
When the resposne arrive the followin events will trigger

### response


### request-error



## Example

```html
  <button id="get" >get</button>

  <http-request trigger="#get" on="click" url="http://localhost:3000/items.html" content-type="html" target="#responses" ></http-request>


  <section id="responses">
    <!-- content will be replaced by the new response -->
  </section>

```


## Append Attribute
if the append attribute is present, the content will be appended to the container, if not present, the content will be completly replaced by the new response

```html
  <button id="get" >get</button>

  <http-request append trigger="#get" on="click" url="http://localhost:3000/items.html" content-type="html" target="#responses"  ></http-request>


  <section id="responses">
    <!-- response will be appended -->
  </section>

```


