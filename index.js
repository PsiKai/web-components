/* global ShadowRootContainer, ElementComponent, ButtonComponent, InputComponent */

class App extends ShadowRootContainer {
  render() {
    this.addElement(CountTracker, { step: 2 })
    this.addElement(CountTracker, { step: 20 })
    this.addElement(BasicInputFeedback, { feedback: "Hello, World!" })
  }
}

class CountTracker extends ElementComponent {
  constructor(props) {
    super(props)
    this.count = 0
    this.step = props.step || 1
  }

  render() {
    this.incrementDisplay = document.createElement("p")

    this.incrementButton = new ButtonComponent({
      onClick: this.setCount.bind(this),
      children: `Increment by ${this.step}`,
      value: 1,
    })
    this.decrementButton = new ButtonComponent({
      onClick: this.setCount.bind(this),
      children: `Decrement by ${this.step}`,
      value: -1,
    })

    this.setCountDisplay()

    this.addElement(this.incrementDisplay)
    this.addElement(this.incrementButton)
    this.addElement(this.decrementButton)
  }

  setCount(e) {
    const { value } = e.target
    this.count += parseInt(value || 0) * this.step
    this.setCountDisplay()
  }

  getCount() {
    return this.count
  }

  setCountDisplay() {
    this.incrementDisplay.textContent = `Count: ${this.getCount()}`
  }
}

class BasicInputFeedback extends ElementComponent {
  constructor(props) {
    super(props)
    this.feedback = props.feedback || ""
  }

  render() {
    this.feedbackDisplay = document.createElement("p")
    this.setFeedbackDisplay()
    this.addElement(this.feedbackDisplay)

    this.setCountInput = new InputComponent({
      type: "text",
      onChange: this.setFeedback.bind(this),
      value: this.getFeedback(),
    })
    this.addElement(this.setCountInput)
  }

  setFeedback(e) {
    const { value } = e.target
    this.feedback = value
    this.setFeedbackDisplay()
  }

  getFeedback() {
    return this.feedback
  }

  setFeedbackDisplay() {
    this.feedbackDisplay.textContent = `Input Value: ${this.getFeedback()}`
  }
}

customElements.define("app-container", App)
customElements.define("count-tracker", CountTracker)
customElements.define("basic-input-feedback", BasicInputFeedback)
