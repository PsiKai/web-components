/* global WebComponent, ShadowRootContainer */
/* eslint-disable no-undef */

class TodoApp extends ShadowRootContainer {
  render() {
    return [
      {
        tag: "todo-list",
        props: {
          todos: ["Learn about Web Components", "Build a Web Component"],
        },
      },
    ]
  }
}

class TodoList extends WebComponent {
  constructor() {
    super()
    this.state = { todos: [] }
  }

  addTodo(newTodo) {
    this.setState(prev => ({ todos: [...prev.todos, newTodo] }))
  }

  removeItem(e) {
    const todo = e.target.previousSibling.textContent
    this.setState(prev => ({
      todos: prev.todos.filter(item => item !== todo),
    }))
  }

  static get observedAttributes() {
    return ["todos"]
  }

  propsDidUpdate(name, _oldValue, newValue) {
    if (name === "todos") {
      this.setState({ todos: newValue.split(",") })
    }
  }

  render() {
    return [
      { tag: "h2", children: "Todo List" },
      {
        tag: "div",
        children: this.state.todos.map(todo => ({
          tag: "p",
          children: [
            todo,
            { tag: "button", props: { onClick: this.removeItem.bind(this) }, children: "X" },
          ],
        })),
      },
      {
        tag: "todo-form",
        props: {
          onSubmit: this.addTodo.bind(this),
        },
      },
    ]
  }
}

class TodoForm extends WebComponent {
  constructor() {
    super()
    this.state = { newTodo: "" }
  }

  handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    const todo = this.state.newTodo
    if (!todo) return

    this.onsubmit(todo)
    this.setState({ newTodo: "" })
    e.target.reset()
  }

  setNewTodo(e) {
    this.setState({ newTodo: e.target.value })
  }

  render() {
    return [
      {
        tag: "form",
        props: {
          onSubmit: this.handleSubmit.bind(this),
        },
        children: [
          {
            tag: "label",
            children: [
              "Add a new todo:",
              {
                tag: "input",
                props: {
                  type: "text",
                  onChange: this.setNewTodo.bind(this),
                  value: this.state.newTodo,
                  placeholder: "Plan your next project",
                },
              },
            ],
          },
          {
            tag: "button",
            children: "Add Todo",
          },
        ],
      },
    ]
  }
}

customElements.define("todo-app", TodoApp)
customElements.define("todo-list", TodoList)
customElements.define("todo-form", TodoForm)
