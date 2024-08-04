class DomNode {
  constructor(attrs, children, parent) {
    if (typeof attrs === "string") {
      this.tag = "text"
      this.children = attrs
    } else {
      this.tag = attrs.tag
      this.props = attrs.props
      this.children = children
    }
    this.parent = parent
  }

  get domElement() {
    return this._domElement
  }

  set domElement(element) {
    this._domElement = element
  }

  isSameTag(node) {
    return this.tag === node.tag
  }

  isSameProps(node) {
    for (const key in this.props) {
      if (!Object.is(this.props[key], node.props[key])) return true
    }
    if (node.props === undefined && this.props === undefined) return true
    return false
  }

  createDomElement() {
    if (this.tag === "text") {
      this.domElement = document.createTextNode(this.children)
    } else {
      this.domElement = document.createElement(this.tag)
      this.setAttributes(this.props)
    }
    return this.domElement
  }

  setAttributes(props) {
    if (!props) return

    const { onClick, onSubmit, onChange, ...rest } = props
    this.domElement.onclick = onClick
    this.domElement.onsubmit = onSubmit
    this.domElement.oninput = onChange

    for (const key in rest) {
      this.domElement.setAttribute(key, rest[key])
    }
  }
}

class VirtualDOM {
  constructor() {
    this.scheduledUpdates = []
    this.tree = []
  }

  static create(elements, root) {
    const newDom = new VirtualDOM()
    const tagName = root.host?.tagName?.toLowerCase() || root.tagName.toLowerCase()
    const vDomRoot = new DomNode({ tag: tagName }, elements, root)
    vDomRoot.domElement = root
    newDom.tree = newDom.buildDomTree(elements, vDomRoot)
    return newDom
  }

  buildDomTree(elements, root) {
    if (!elements) return null

    return elements.map(element => {
      let newNode = new DomNode(element, null, root)
      let children = element.children

      if (Array.isArray(children)) {
        children = this.buildDomTree(children, newNode)
      } else if (typeof children === "string") {
      } else if (!!children) {
        children = this.buildDomTree([children], newNode)
      }

      newNode.children ||= children
      return newNode
    })
  }

  reconcile(oldDom = [], newDom = this.tree) {
    for (let i = 0; i < newDom.length; i++) {
      const newElement = newDom[i]
      const oldElement = oldDom[i]

      if (!oldElement) {
        console.log("oldElement is null", { newElement })
        const newDomElement = newElement.createDomElement()

        this.scheduledUpdates.push(() => {
          newElement.parent.domElement.appendChild(newDomElement)
        })

        if (Array.isArray(newElement.children)) {
          this.reconcile([], newElement.children)
        } else if (typeof newElement.children === "string") {
          this.scheduledUpdates.push(() => {
            newDomElement.textContent = newElement.children
          })
        } else if (!!newElement.children) {
          this.reconcile([], [newElement.children])
        }
        continue
      }

      if (typeof newElement === "string") {
        console.log("newElement is string", { newElement, oldElement })
        if (newElement !== oldElement) {
          this.scheduledUpdates.push(() => {
            oldElement.textContent = newElement
          })
        }
        continue
      }

      if (!newElement.isSameTag(oldElement)) {
        console.log("newElement is different tag", { newElement, oldElement })
        const newDomElement = newElement.createDomElement()
        this.scheduledUpdates.push(() => {
          oldElement.domElement.replaceWith(newDomElement)
        })
        continue
      }

      newElement.domElement = oldElement?.domElement

      if (!newElement.isSameProps(oldElement)) {
        console.log("newElement is different props", { newElement, oldElement })
        this.scheduledUpdates.push(() => {
          oldElement.setAttributes(newElement.props)
        })
        newElement.domElement = oldElement.domElement
      }

      if (Array.isArray(newElement.children)) {
        console.log("newElement has array of children", newElement)
        this.reconcile(oldElement.children, newElement.children)
        continue
      }

      if (typeof newElement.children === "string") {
        console.log("newElement string as child", { newElement, oldElement })
        if (newElement.children !== oldElement.children) {
          this.scheduledUpdates.push(() => {
            oldElement.domElement.textContent = newElement.children
          })
        }
        continue
      }

      if (!!newElement.children) {
        console.log("newElement has single child", { newElement, oldElement })
        this.reconcile(oldElement.children, [newElement.children])
        continue
      }
    }

    if (oldDom.length > newDom.length) {
      this.trimBranches(oldDom, newDom)
    }
  }

  trimBranches(oldDom, newDom) {
    if (oldDom.length > newDom.length) {
      for (let i = oldDom.length - 1; i >= newDom.length; i--) {
        this.scheduledUpdates.push(() => {
          oldDom[i].domElement.remove()
        })
      }
    }
  }

  scheduleUpdates() {
    const scheduler = new DomScheduler(this.scheduledUpdates)
    scheduler.executeUpdates()
  }
}

class DomScheduler {
  constructor(scheduledUpdates = [], batchSize = 10) {
    this.scheduledUpdates = scheduledUpdates
    this.batchSize = batchSize
  }

  scheduleUpdate(update) {
    this.scheduledUpdates.push(update)
  }

  runUpdates(updates) {
    updates.forEach(update => update())
  }

  executeUpdates() {
    while (this.scheduledUpdates.length) {
      const batch = this.scheduledUpdates.slice(0, this.batchSize)
      this.scheduledUpdates = this.scheduledUpdates.slice(this.batchSize)
      requestAnimationFrame(() => this.runUpdates(batch))
    }
  }
}

class WebComponent extends HTMLElement {
  constructor() {
    super()
    this.state = {}
  }

  connectedCallback() {
    this.renderChildren()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.propsDidUpdate(name, oldValue, newValue)
  }

  renderChildren() {
    console.log("renderChildren")
    const elements = this.render()
    const newVirtualDom = VirtualDOM.create(elements, this.shadow || this)
    newVirtualDom.reconcile(this.currentDom?.tree)
    newVirtualDom.scheduleUpdates()
    this.currentDom = newVirtualDom
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
}

customElements.define("shadow-root-container", ShadowRootContainer)
customElements.define("element-component", WebComponent)
