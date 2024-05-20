/* global ShadowRootContainer, ElementComponent, ButtonComponent, InputComponent */

class App extends ShadowRootContainer {
  render() {
    return [
      // new CountTracker({ step: 2 }),
      // new CountTracker({ step: 5 }),
      // new BasicInputFeedback({ feedback: "Hello, World!" }),
      { tag: "count-tracker", props: { step: 2 } },
      { tag: "count-tracker", props: { step: 5 } },
      { tag: "basic-input-feedback", props: { feedback: "Hello, World!" } },
    ]
  }
}

class CountTracker extends WebComponent {
  constructor() {
    super()
    this.state = { count: 0 }
  }

  setCount(e) {
    const { value } = e.target
    const newCount = this.state.count + parseInt(value) * this.step
    this.setState({ count: newCount })
  }

  render() {
    this.step = this.getAttribute("step") || 1

    return [
      { tag: "p", children: `Count: ${this.state.count}` },
      {
        tag: "button",
        props: {
          onClick: this.setCount.bind(this),
          value: 1,
        },
        children: `Increment by ${this.step}`,
      },
      {
        tag: "button",
        props: {
          onClick: this.setCount.bind(this),
          value: -1,
        },
        children: `Decrement by ${this.step}`,
      },
    ]
  }
}

class BasicInputFeedback extends WebComponent {
  constructor() {
    super()
    this.state = { feedback: "" }
  }

  static get observedAttributes() {
    return ["feedback"]
  }

  setFeedback(e) {
    const { value } = e.target
    this.setState({ feedback: value })
  }

  propsDidUpdate(name, oldValue, newValue) {
    if (name === "feedback") {
      this.state = { feedback: newValue }
    }
  }

  render() {
    return [
      { tag: "p", children: `Input Value: ${this.state.feedback}` },
      {
        tag: "input",
        props: {
          type: "text",
          onChange: this.setFeedback.bind(this),
          value: this.state.feedback,
        },
      },
    ]
  }
}

customElements.define("app-container", App)
customElements.define("count-tracker", CountTracker)
customElements.define("basic-input-feedback", BasicInputFeedback)
