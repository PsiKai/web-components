class WebComponent extends HTMLElement {
  constructor() {
    super()
    this.state = {}
    this.elements = []
  }

  connectedCallback() {
    this.renderChildren()
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.propsDidUpdate()
  }

  renderChildren() {
    const elements = this.render()
    this.compareElements(elements, this.elements)
    this.elements = elements
  }

  compareElements(newElements, oldElements, parentElement = this) {
    const currentElements = parentElement.childNodes

    for (let i = 0; i < newElements.length; i++) {
      const newElement = newElements[i]
      const oldElement = oldElements[i]

      if (typeof newElement === "string") {
        if (newElement !== oldElement) {
          parentElement.appendChild(newElement)
        }
        continue
      }
      const {
        tag: newElementTag,
        props: newElementProps,
        children: newElementChildren,
      } = newElement

      if (oldElement && currentElements[i]) {
        const {
          tag: oldElementTag,
          props: oldElementProps,
          children: oldElementChildren,
        } = oldElement

        if (newElementTag !== oldElementTag) {
          this.replaceChild(this.createNewElement(newElement), currentElements[i])
        } else {
          const shouldUpdateProps = this.compareProps(newElementProps, oldElementProps)
          if (shouldUpdateProps) {
            this.setAttributes(currentElements[i], newElementProps)
          }
          this.compareChildren(newElementChildren, oldElementChildren, currentElements[i])
        }
      } else {
        parentElement.appendChild(this.createNewElement(newElement))
      }
    }
  }

  replaceChild(newElement, oldElement) {
    oldElement.replaceWith(newElement)
  }

  compareProps(newProps, oldProps) {
    for (const key in newProps) {
      if (!Object.is(newProps[key], oldProps[key])) {
        return true
      }
    }
    return false
  }

  compareChildren(newChildren, oldChildren, parentElement) {
    if (typeof newChildren === "string") {
      if (newChildren !== oldChildren) {
        parentElement.textContent = newChildren
      }
    } else if (!newChildren) {
      parentElement.innerHTML = ""
    } else if (Array.isArray(newChildren)) {
      this.compareElements(newChildren, oldChildren, parentElement)
    } else {
      this.compareElements([newChildren], oldChildren, parentElement)
    }
  }

  createNewElement({ tag, props, children }) {
    const element = document.createElement(tag)
    this.setAttributes(element, props)

    if (typeof children === "string") {
      element.textContent = children
    } else if (Array.isArray(children)) {
      for (const child of children) {
        if (typeof child === "string") {
          const textNode = document.createTextNode(child)
          element.appendChild(textNode)
        } else element.appendChild(this.createNewElement(child))
      }
    } else if (!children) {
      element.innerHTML = ""
    } else {
      element.appendChild(children)
    }
    return element
  }

  setAttributes(element, props) {
    const rest = this.setEventListeners(element, props)
    for (const key in rest) {
      element.setAttribute(key, rest[key])
    }
  }

  setEventListeners(element, props = {}) {
    const { onClick, onSubmit, onChange, ...rest } = props
    element.onclick = onClick
    element.onsubmit = onSubmit
    element.oninput = onChange
    return rest
  }

  render() {
    throw new Error("Method not implemented: render")
  }

  setState(newState) {
    if (typeof newState === "function") {
      this.state = newState(this.state)
    } else {
      this.state = newState
    }
    this.renderChildren()
  }
}

class ShadowRootContainer extends WebComponent {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
  }

  renderChildren() {
    const elements = this.render()
    this.compareElements(elements, this.elements, this.shadow)
    this.elements = elements
  }
}

customElements.define("shadow-root-container", ShadowRootContainer)
customElements.define("element-component", WebComponent)
