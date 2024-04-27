## Web Component to create web components
```html
  

<web-component name="MyWebComponent" tag="my-web-component">
    <template>
        <!-- this will be the content of the web component -->

        <button id="increment" onclick="counter += 1">+</button>
        <span >({counter})</span>
        <button id="decrement" onclick="counter -=1">-</button>
        
    </template>
    <script>

    </script>
</web-component>

```



## State machine in web components

```html

<button id="done-btn">done</button>

<state-machine id="my-machine" data-context-var="1" initial="#start">
    <machine-state id="start">
        <machine-transition target="#next">
            <app-modal>
                <!-- ask for user input and make this the trigger of the next transition -->
            </app-modal>
        </machine-transition>
        <machine-transition trigger="#done-btn" on="click" target="#done"></machine-transition>
    </machine-state>

    <machine-state id="next" data-variable="this will be passed every time when entering this state"></machine-state>

    <machine-state id="done" type="final" ></machine-state>
</state-machine>


```



