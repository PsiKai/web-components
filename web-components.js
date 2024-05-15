class ShadowRootContainer extends HTMLElement {
  constructor() {
    super()
    this.elements = []
    this.shadow = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
    for (const element of this.elements) {
      this.shadow.appendChild(element)
    }
  }

  addElement(Component, props = {}) {
    this.elements.push(new Component({ shadow: this.shadow, ...props }))
  }

  render() {
    throw new Error("Method not implemented: render")
  }
}

class ButtonComponent extends HTMLButtonElement {
  constructor(props) {
    super()
    this.setButtonProps(props)
  }

  connectedCallback() {
    this.addEventListener("click", this.onClick)
    for (const key in this.attrs) {
      this.setAttribute(key, this.attrs[key])
    }
  }

  setButtonProps(props) {
    const { onClick, children, ...attrs } = props
    this.onClick = onClick
    this.attrs = attrs
    this.textContent = children
  }
}

class ElementComponent extends HTMLElement {
  constructor(props) {
    super()
    if (!props.shadow) {
      throw new Error("ElementComponent must be passed a shadow root")
    }
    this.shadow = props.shadow
    this.elements = []
  }

  connectedCallback() {
    this.render()
    for (const child of this.elements) {
      this.shadow.appendChild(child)
    }
  }

  render() {
    throw new Error("Method not implemented: render")
  }

  addElement(element) {
    this.elements.push(element)
  }
}

customElements.define("shadow-root-container", ShadowRootContainer)
customElements.define("button-component", ButtonComponent, { extends: "button" })
customElements.define("element-component", ElementComponent)
