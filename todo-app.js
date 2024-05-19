class TodoApp extends ShadowRootContainer {
  render() {
    // return [new TodoList()]
    return [{ tag: "todo-list" }]
  }
}

class TodoList extends WebComponent {
  constructor(props) {
    super(props)
    this.state = { todos: [], newTodo: "" }
  }

  addTodo(e) {
    e.preventDefault()
    const todo = this.state.newTodo
    if (!todo) return

    this.setState(prev => ({ todos: [...prev.todos, todo], newTodo: "" }))
    e.target.reset()
  }

  setNewTodo(e) {
    this.setState(prev => ({ ...prev, newTodo: e.target.value }))
  }

  render() {
    return [
      { tag: "h2", children: "Todo List" },
      { tag: "div", children: this.state.todos.map(todo => ({ tag: "p", children: todo })) },
      {
        tag: "form",
        props: {
          onSubmit: this.addTodo.bind(this),
        },
        children: [
          {
            tag: "input",
            props: {
              type: "text",
              onChange: this.setNewTodo.bind(this),
              value: this.state.newTodo,
            },
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
