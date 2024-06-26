# KanbanBoard Component

`kanban-board`


This element represent a Kanban board where various columns can be defined.


## Simple Example


In this example we have a kanban board with 3 columns, defined by the `kanban-column` element, the tasks can be any element, native or other web component.
The user will be able to drag and drop tasks between columns.

_Note:_ _the `title` attribute on the board and columns will be used on the UI, so make it human readable._

```html
  <kanban-board id="main-todo" title="test board">

    <kanban-column id="todo" title="TODO">
      <simple-card>Task description here</simple-card>
    </kanban-column>
    
    <kanban-column id="doing" title="DOING">
      <div>other task here</div>
    </kanban-column>
    
    <kanban-column id="done" title="DONE">
      <note-card>
        other task
      </note-card>
    </kanban-column>

  </kanban-board>
```


## Events

**Column Id event**
The `kanban-board` emits an event that match the id of each column when a card is moved.
In this example, a modal will be shown every time a task move to the `done` column.

**Change event**
This event will be triggered every time a task is moved between columns, but the event name will always be `change`

### Event Example
```html
  <kanban-board id="main-todo" title="test board">

    <kanban-column id="doing" title="DOING">
      <simple-card>Task description here</simple-card>
      <div>other task here</div>
    </kanban-column>
    
    <kanban-column id="done" title="DONE">
    </kanban-column>

  </kanban-board>


  <app-modal trigger="#main-todo" on="done">Congratulations on finishing this task</app-modal>

```
