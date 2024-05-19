class TodoApp extends ShadowRootContainer {
  render() {
    return [
      {
        tag: "todo-list",
        props: { todos: ["Learn about Web Components", "Build a Web Component"] },
      },
    ]
  }
}

class TodoList extends WebComponent {
  constructor(props) {
    super(props)
    this.state = { todos: [] }
  }

  addTodo(newTodo) {
    this.setState(prev => ({ todos: [...prev.todos, newTodo] }))
  }

  static get observedAttributes() {
    return ["todos"]
  }

  propsDidUpdate() {
    this.state = { todos: this.getAttribute("todos").split(",") }
  }

  render() {
    return [
      { tag: "h2", children: "Todo List" },
      { tag: "div", children: this.state.todos.map(todo => ({ tag: "p", children: todo })) },
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
