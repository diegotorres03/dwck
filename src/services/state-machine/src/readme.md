# State Machines

Web Component representation of a finite automata.

```html
<state-machine id="unique-id" initial-state="start"></state-machine>
```

`id` is an unique identifier for the state machine, this will be used for html, but this id will be passed to js.
`initial-state` is how we tell the machine where to start.



```html
```

## State
This is a 1:1 representation of a xstate state.
```html
<state-machine id="unique-id" initial-state="start">
  <machine-state id="unique-id"></machine-state>
</state-machine>
```

`action` when specified, is a non blocking function that will be executed right after the new state is entered.

## Transitions
`emit` is also called `type` is

```html
<state-machine id="unique-id" initial-state="start">
  <machine-state id="unique-id">
    <machine-transition emit="submit" target="nextState"></machine-transition>
  </machine-state>
</state-machine>
```

```

## Actions

```html
<state-machine id="unique-name" initial-state="start">
  <machine-state emit="" target="" action="log"></machine-state>
</state-machine>
```

## Guards/Filters


# Events

# components


# Examples

## Auth Machine

```html

  <div id="authentication-section">

    <script id="machine-actions-filters">
      const actions = Object.freeze({
        checkToken: async (ctx, event) => {
          console.log('checking session')
          const token = window.localStorage.getItem('token')
          if (!token) return { emit: 'noSession' }
          return { emit: 'sessionActive', data: { token } }
        },
  
        authenticate: async (ctx, event) => {
          const authRes = { token: 'valid_token' }
          console.table(authRes)

          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ emit: 'authenticated', data: authRes })
            }, 5000)
          })
          // return { emit: 'authenticated', data: authRes }
        },

        saveSession: async (ctx, event) => {
          console.group('saveSession')
          console.log('event', event)
          console.log('context', ctx)
          console.groupEnd()
          const token = event.detail.data.token
          window.localStorage.setItem('token', token)
          return { context: { token } }
        },

        removeSessionToken: async () => {
          window.localStorage.removeItem('token')
        },

        logIn: async (ctx, event) => { },
        log: (ctx, event) => console.log('LOG:', ctx, event),
      })
    </script>

    <button id="save-btn">save</button>

    <event-source id="on-load" trigger="window" on="load"></event-source>


    <state-machine visible id="ui-state-machine" initial-state="start" trigger="event-stream" on="data">

      <machine-state id="start" action="checkToken">
        <machine-transition emit="sessionActive" target="idle"></machine-transition>
        <machine-transition emit="noSession" target="loginForm"></machine-transition>
      </machine-state>

      <!-- here the login modal opens and ask for email password convination -->
      <machine-state id="loginForm">
        <machine-transition trigger="#login-form" on="accepted" emit="submit" target="authenticating"
          action="authenticate"></machine-transition>

      </machine-state>

      <machine-state id="authenticating">
        <machine-transition trigger="#save-btn" on="click" emit="authenticated" target="idle" action="saveSession"></machine-transition>
        <machine-transition emit="authenticationFailed" target="start" action="log"></machine-transition>
      </machine-state>

      <machine-state id="idle" action="log">
        <machine-transition trigger="#logout-btn" on="click" emit="logout" target="loginForm"
          action="removeSessionToken"></machine-transition>
        <machine-transition emit="exit" target="end"></machine-transition>
      </machine-state>

      <machine-state id="end" type="final" action="log"></machine-state>

    </state-machine>


    <app-modal id="login-form" trigger="state-machine" on="loginForm">
      <h1 slot="title">Login</h1>
      <section slot="main" class="flex-row space-around">
        <div>
          <label for="login-email">email:</label>
          <input type="email" name="email" id="login-email">
          <br>
          <label for="login-password">password:</label>
          <input type="password" name="password" id="login-password">
        </div>
      </section>
    </app-modal>

```



## Con la nueva version suave

```html


  <button id="start-machine">start</button>
  <hr>
  <button data-test="jaja" id="red-btn">red</button>
  <button data-test="jaja" id="green-btn">green</button>

  <script>
    document.querySelector('#green').addEventListener('active', ev => alert('aca esta'))
  </script>

  <!-- <flip-card trigger="#green" on="active" disabled></flip-card> -->


  <state-machine id="test-machine" initial="start" data-counter="10" trigger="#start-machine" on="click">
    <machine-state id="start">
      <machine-transition trigger="#green-btn" on="click" target="green"></machine-transition>
      <machine-transition trigger="#red-btn" on="click" target="red"></machine-transition>
    </machine-state>


    <machine-state id="green">
      <!-- <machine-transition trigger="#red-btn" on="click" target="red"></machine-transition> -->

      <!-- transitions that don't have a trigger, are ment to be immediate transitions -->
      <machine-transition target="red" wait="4s"></machine-transition>
      <app-modal>
        <h2 slot="title">green</h2>
      </app-modal>
    </machine-state>


    <machine-state id="red">
      <machine-transition trigger="#green-btn" on="click" target="green"></machine-transition>
      <app-modal>
        <h2 slot="title">red</h2>
      </app-modal>
    </machine-state>

  </state-machine>


```