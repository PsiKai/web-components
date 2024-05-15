/* global ShadowRootContainer, ElementComponent, ButtonComponent */

class App extends ShadowRootContainer {
  render() {
    this.addElement(CountTracker, { step: 2 })
    this.addElement(CountTracker, { step: 20 })
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

customElements.define("count-tracker", CountTracker)
customElements.define("app-container", App)
