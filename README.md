# scribio
Scribio is a Javascript library to perform inline editing on a webpage. It is inspired by [x-editable](https://vitalets.github.io/x-editable/),
but doesn't rely on jquery, offers a lot of customization options and can be extended by the mean of types and renderers.

## What's cool about it
- Three dependencies (deepmerge and flat for customization options, and Popper.js for the included Popup renderer)
- Can be extended, you can create custom types (user input) and renderers (where the types are rendered). Scribio ships with a few types and a popup renderer by default
- Highly customizable using configuration options
- Possibility to develop and load themes which are based on configuration options (currently a Bootstrap 4 theme is available)

## Installation
Once the library is loaded on your webpage, you can do the following to trigger Scribio on an element.
```js
const div = document.getElementById('myDiv');
Scribio.span(div, { /* config */ });
```
