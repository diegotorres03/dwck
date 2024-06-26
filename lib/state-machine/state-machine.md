# State Machine Component

The `<state-machine>` component allows defining and running a finite state machine.

## Usage

```html
<state-machine>
  <machine-state>
    <state-transition />
  </machine-state>
</state-machine>
```

## Attributes

- `trigger` - The element that will trigger state transitions. Default is the component itself.
- `on` - The event that will trigger on the trigger element. Default is "click". 
- `id` - A unique id for the state machine.
- `initial` - The id of the initial state.
- `final` - The id of the final state.

## Machine States

States are defined with `<machine-state>` elements inside the state machine.

- `id` - A unique id for the state.

## Transitions

Transitions are defined with `<state-transition>` elements inside states.

- `target` - The id of the target state.
- `wait` - How long to wait before transitioning (for async transitions).
- `trigger` - Optional element to listen for transition trigger instead of main trigger.  
- `on` - Optional event to listen for on the transition trigger instead of the main trigger event.
- `filter` - Optional, global javascript function to filter an event
- `not` - Invert the filter expression.

## Example

```html

  <state-machine trigger="#start-btn" on="click" id="test-machine" initial="start" final="done" data-counter="10"
    trigger="#start-machine" on="click">

    <machine-state id="start">
      <state-transition target="green" wait="1s"></state-transition>
    </machine-state>

    <machine-state id="green">
      <state-transition target="red" wait="1s"></state-transition>
    </machine-state>

    <machine-state id="red" wait="2s">

      <state-transition trigger="#re-start-modal" on="accepted" target="green" filter="isOdd"></state-transition>
      <state-transition trigger="#re-start-modal" on="accepted" target="done" not filter="isOdd"></state-transition>
      <!-- <state-transition trigger="#re-start-modal" on="accepted" target="green"></state-transition> -->
      <state-transition trigger="#re-start-modal" on="declined" target="done"></state-transition>

    </machine-state>

    <machine-state id="done" final>
    </machine-state>

  </state-machine>


  <script>
    function isOdd({ value }) {
      const odd = Number(value) % 2 === 1
      console.log('isOdd',odd)
      return odd
    }
  </script>

```

This defines a simple state machine that transitions between colored states with optional filtering of transitions.

