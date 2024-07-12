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



## How to use

use the `kanban-board` tag to create a new kanban board.
Give it and `id` attribute and a `title` attribute, this attribute will be used as the title of the board, so make it human readable.

Now, create the colunms you will require, for example, a regular board will have a `todo`, `doing` and `done` columns, but feel free to change it according to what you need.

In important that you add an `id` and `title` to each column. Id should be unique in the document, and the title will be displayed on the UI so make it human readable.

So far we should have something like this:
```html
  <kanban-board id="main-todo" title="test board">
    <kanban-column id="todo" title="TODO">

    </kanban-column>
    <kanban-column id="doing" title="DOING">

    </kanban-column>
    <kanban-column id="done" title="DONE">

    </kanban-column>
  </kanban-board>

```

Now you have an empty kanban board.

to add tasks, insert a `simple-card` tag on the desired column. Inside the `simple-card` add the content of the task, any valid HTML can go here.




## Prompt


