/* global WebComponent, ShadowRootContainer */
/* eslint-disable no-undef */

class App extends ShadowRootContainer {
  render() {
    return [
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

  static get observedAttributes() {
    return ["step"]
  }

  propsDidUpdate(name, _oldValue, newValue) {
    if (name === "step") {
      this.step = parseInt(newValue) || 1
    }
  }

  render() {
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

  propsDidUpdate(name, _oldValue, newValue) {
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
