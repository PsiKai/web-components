## Web Components

Playing around with the [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) API to see what I could come up with.

### Getting Started

Nothing to setup here, no dependencies or server. Just clone pull up the `index.html` in the browser. Tested in Firefox and Brave, and it worked in both.

Or, create your own components are application with the core `web-components.js` file.

### Declarative API

My goal was to implement web components in a way that vaguely resembles React. I've implemented a "library" of sorts in `web-components.js` where I've attempted to define component-like interfaces for common reusable elements.

#### `ShadowRootContainer`

For defining a root for your application or web component sub-module. Used similar to `index.js` in your typical react application, where instead of `<div id="root">` it generates a custom HTMl element that instantiates and attaches a shadow root to the document. This is defined where ever you place the custom element in the document. See the `app-container` element in `index.html`

#### `ElementComponent`

A standard component type, built off of an autonomous HTML element. This means it has no special HTML attributes or behaviors (think `button`, `input`, etc.). This is used to wrap a set of child elements or components and logic for rendering those components. Much like the `extends React.Component`, this interface handles adding its own internal elements to the shadow root.

#### `InputComponent`, `ButtonComponent`

These are extensions of standard HTML elements. They inherit all the properties of the HTML element they inherit from, but also include some React-like convenience methods for setting event listeners like `onChange`. There is also a passthrough of `props` to th element, so the consumer can conveniently set attributes on element, such as `type="text"`. Each element type needs to be added separately, so just the two element types for now.

### Example Usage

I've create a basic application with the web components to exercise the API and see howeasy or difficult it is to use. Very basic stuff: counter state, controlled inputs with reactive feedback.

#### `App`

Again, to mimic React, I've created an `App` component that inherits from `ShadowRootContainer` to act as the root of my application. All that's needed is to implement a `render` method that calls `addElement` with component class names, and the desired props.

#### `CountTracker`

This one does your standard increment/decrement counter on button click. It inherits from `ElementComponent`, and in my opinion most closly resembles the old React class component API. Calling `super` in the constructor with `props` should seem familiar, and there is some semblance of state setting. The `render` method handles creating elements and adding them to the list of elements to attach to the shadow root. There is Composition used here by creating nested, reusable button components to manipulate the count.

#### `BasicInputFeedback`

Same as the counter tracker, implementing the `ElementComponent` parent behavior, this time creating a controlled text input that displays the input value back to the user ina paragraph tag.
