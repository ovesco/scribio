# scribio
Scribio is a Javascript library to perform inline editing on a webpage. It is inspired by [x-editable](https://vitalets.github.io/x-editable/),
but doesn't rely on jquery, offers a lot of customization options and can be extended by the mean of types and renderers.

> DISCLAIMER: This project is still under active development, use it at your own risks

## What's cool about it
- Three dependencies (deepmerge and flat for customization options, Popper.js for the included Popup renderer)
- Can be extended, you can create custom types (user input) and renderers (where the types are rendered). Scribio ships with a few types and a popup renderer by default
- Highly customizable using configuration options
- Possibility to develop and load themes which are based on configuration options (currently a Bootstrap 4 theme is available)

## Installation
### Including it in your web page
The library comes in two flavors, either including or not Popper.js. You can include the corresponding file
````html
<script src="path/to/scribio/scribio.min.js"></script> <!-- without popper -->
<script src="path/to/scribio/scribio.popper.min.js"></script> <!-- with popper -->
````
Once the library is loaded on your webpage, you can do the following to trigger Scribio on an element.
```js
const div = document.getElementById('myDiv');
Scribio.span(div, { /* config */ });
```
You'll notice that Scribio doesn't include any pre-defined style, this is a development choice to avoid enforcing you
with pre-built mandatory styling you'll have to override using `!important` rules. Rather than that, it can be easily
customized to fit a global framework, for example Bootstrap.

### Including the bootstrap theme
To load the bootstrap theme simply include the script *after* including Scribio.
````html
<script src="path/to/scribio/scribio.popper.min.js"></script>
<script src="path/to/scribio/scribio.bootstrap-theme.min.js"></script>
````
This enforces a new markup for the popup renderer (using bootstrap's popover), buttons and inputs.

### Requiring Scribio in your application
You can also directly work with Scribio in your application. Simply require it:
````js
import Scribio from 'Scribio';

const div = document.getElementById('myDiv');
Scribio.span(div, { type: { name: 'text' }, /* other config... */ });
````
To use the bootstrap theme, include it and load it:
````js
import Scribio, { BootstrapTheme } from 'Scribio';

Scribio.loadTheme(BootstrapTheme('sm')) /* pass a global bootstrap size for buttons and inputs */
````

#### Using the popup renderer
Scribio currently ships with a single renderer, being the Popup renderer. It internally uses Popper.js
to display popups and, as such, requires the library to be loaded. It will first try to load it from
`window.Popper` but will cry if it can't find it. Another way is to provide Scribio with your custom Popper
instance like so.

````js
import MyPopperInstance from 'popper.js';

Scribio.loadTheme({
  renderers: [{ name: 'popup', config: { popper: MyPopperInstance } }],
});
````

## Configuration
Scribio can be configured with the following options. Each of them has a given type, which should be the returned value. As such, each option can be
a function returning a value. The `async` column tells you if your function can return a Promise if necessary. All functions
are automatically binded to:
- The instance by default
- The type when under the `type.` namespace (mainly configuring the type under `type.config`)
- The renderer when under the `renderer.` namespace (mainly configuring the renderer under `renderer.config`)
This means that you'll have access to it using `this`.

> Note that the configuration is an object, keys like `handler.onSubmit` refers to { handler: { onSubmit: ..., } }

You can check all defaults in the default config file.

### General options
|key|type|description|async|
|---|---|---|---|
|trigger|string|Scribio trigger, can be either `'click', 'hover' or 'none'`|no|
|emptyValue|any|The **empty value**, which indicates to Scribio that the current instance has no value|no|
|voidDisplay|string|The text displayed if the current value is equal to the config option `emptyValue`|no|
|currentValue|any|This instance's initialization value|no|
|valueDisplay|function|What should be displayed for a given value, by default will use the Type to display it|no|

### Type and renderer
Quickly override default configuration for type and renderer as well as choose which type and renderer to use for this instance.

|key|type|description|async|
|---|---|---|---|
|type.name|string|Used type's name for this instance|no|
|type.config|object|Config passed to the type|no|
|renderer.name|string|Used renderer's name for this instance|no|
|renderer.config|object|Config passed to the renderer|no|

### Server handler
By default, Scribio ships with a server handler which performs an async request on submit to a server.
This can be easily overriden by setting the `handler.onSubmit` option as seen below, but these options
allows you to configure how the request is sent if you keep the default handler.

|key|type|description|async|
|---|---|---|---|
|server.url|string|Server's URL to which the request should be sent|no|
|server.requestParams|object|Configuration passed to the `fetch` request, you could for example set `{ method: 'POST' }` here|no|
|server.resultFormatter|function|This function should return the new value after submit, you can use to change it or extract it from the given fetch response|no|

### Handlers
Multiple handlers allow you to hook into the lifecycle of your Scribio instance.

|key|type|description|async|
|---|---|---|---|
|handler.onOpen|function|Called when the instance is triggered|yes|
|handler.onClose|function|Called when the instance is closed|yes|
|handler.onSubmit|function|Called when a value is submitted, by default tries to send a server request. Takes three arguments, the new value, an onSuccess callback, which takes the new value, and an onError callback which takes the error|using callbacks|
|handler.onError|function|Called when a function arise, takes two arguments, the error and a callback that MUST be called with the error as argument|using callback|
|handler.onCancel|function|If the edition is cancelled|yes|
|handler.onLoading|function|Called when the loading status change|no|
|handler.errorDisplay|function|Called when there's an error to display, should return a string|no|
|handler.validate|function|Called right after new value is submitted, should return a boolean indicating if the value is correct or not|no|

### Buttons
Configuration options for the two action buttons. These can be overriden by redefining the used template in the template configuration options.

|key|type|description|async|
|---|---|---|---|
|buttons.enabled|boolean|If the buttons are enabled or not|no|
|buttons.submitText|string|The text to display in the submit button|no|
|buttons.cancelText|string|The text to display in the cancel button|no|

### Templates
You can override the global templates here if you would like to change the generated markup for different parts of the library.
Note that each important element has an `aria-` attribute that *must* be set.

|key|type|description|async|
|---|---|---|---|
|template.edit|string|The template used to generate the global edition container which includes type and action buttons|yes|
|template.buttons|string|The action buttons template|yes|
|template.read|string|The template used to display the value when not triggered|no|
|template.loading|string|The template used to indicate a loading state waiting on the renderer to finish rendering itself|no|

## Existing types
Scribio currently ships with 4 types ready-to-use.

### Text
You can use it by setting your config as such `{ type: { name: 'text' }}`. It comes with the following configuration options:

|key|type|default|description|async|
|---|---|---|---|---|
|class|string|`''`|Input additional class|no|
|type|string|`'text'`|The input html type, for example text, number... Can also be textarea|no|
|attributes|string|`''`|Additional html attributes|no|

### Select
You can use it by setting your config as such `{ type: { name: 'select' }}`. It comes with the following configuration options:

|key|type|default|description|async|
|---|---|---|---|---|
|multiple|bool|`false`|If your select accepts multiple values. If yes, its returned value will be an array|no|
|dataSource|array|`[]`|Your input data source. Must be an array of objects of the type`{ value: 1, text: 'My label' }`|yes|
|class|string|`''`|Input additional class|no|
|displaySeparator|string|`', '`|If multiple, when the value is displayed, it will be separated by it|no|

### Radio
You can use it by setting your config as such `{ type: { name: 'radio' }}`. It comes with the following configuration options:

|key|type|default|description|async|
|---|---|---|---|---|
|dataSource|array|`[]`|Your input data source. Must be an array of objects of the type`{ value: 1, text: 'My label' }`|yes|
|containerClass|string|`''`|Radio container class|no|
|labelClass|string|`''`|Radio labels class|no|
|radioClass|string|`''`|Radio input class|no|

### Checkbox
You can use it by setting your config as such `{ type: { name: 'checkbox' }}`. It comes with the following configuration options:

|key|type|default|description|async|
|---|---|---|---|---|
|dataSource|array|`[]`|Your input data source. Must be an array of objects of the type`{ value: 1, text: 'My label' }`|yes|
|containerClass|string|`''`|Checkbox container class|no|
|labelClass|string|`''`|Checkbox labels class|no|
|checkboxClass|string|`''`|Checkbox input class|no|
|displaySeparator|string|`', '`|When the value is displayed it will be separated by it|no|

## Renderers
Currently Scribio ships with a single renderer.

### Popup renderer
Displays the edition in a popup handled by Popper.js. You can use it by setting your config as such `{ renderer: { name: 'popup' } }`
It comes with the following default configuration:

|key|type|default|description|async|
|---|---|---|---|---|
|popperConfig|object|`{ placement: 'top' }`|Configuration passed down to Popper on initialization|no|
|popper|object|`window.Popper`|Popper instance|no|
|transitionDuration|number|`300`|Transition duration in milliseconds|no|
|closeOnClickOutside|bool|`true`|If clicking outside the popup cancel and close the edition session|no|
|popupTemplate|string|Check the source|The popup's template, note the aria elements which are required if you override this option|no|

##Customizing Scribio
Scribio can be easily customized by the means of adding new types, renderers and themes which will be explained here.

### API and lifecycle
When you first call `Scribio.span` on an element, it will create and attach a new *instance* to it.

### Instance API
The instance exposes the following methods:
- setNewValue(value) which allows you to dynamically update this instance's current value
- setLoading(status) which will show/hide the loading status
- open() which starts a new edition session if none currently exists
- close() which closes any existing session
- destroy() which destroys the instance's markup and removes existing listeners
- refreshContent() which triggers a new rendering of the displayed value

Furthermore the instance provides the following attributes:
- `config` which exposes the instance's config
- `createType` a function which returns a new instance of the type
- `createRenderer` a function which returns a new instance of the renderer
- `value` the instance's current value
- `session` if an edit session exists it will be stored here, null otherwise
- `target` the HTML node to which this instance is attached
- `ariaElement` the generated read element

### Session API
Once your instance was triggered and opens a new edit session, its `session` attribute will have a new Session object.
It offers the following methods:
- open() which opens the renderer and displays the type
- cancel() which cancels the edition and closes it
- setLoading(status) which displays a loading status in the renderer and disable/enable the input
- error(error) which displays an error in the renderer
- submit() triggers a submit, retrieves the type's value and handles it
- destroySession() destroys this session, should not be called directly, rather use `instance.close()`

It also exposes the following attributes:
- `instance` which is the instance to which this session is attached and opened from
- `type` an instance of the type
- `renderer` an instance of the renderer
- `markup` which is the edit markup from the `template.edit` configuration

#### Type and renderer creation
Once a session is created, it will automatically create a new instance of the type and of the renderer. As such,
they can store in themselves inner properties and attributes, types and renderer lives as long as the edit session
is opened.

## Creating your own type
You can add new types to Scribio very easily. It all comes down to creating a new class and registering it.

### Creating your class
The default type class code is the following

````js
export default class {
  constructor(instance, config = {}) {
    /* Reference to the instance and the given config */
  }
  
  init() {
    /* Here you can setup your type and perform async jobs by returning a Promise */
  }

  show(rootNode, value) {
    /* Called when the type is displayed, you should append your type markup to the given rootNode and feed it with the given value */
  }

  getInputValue() {
    /* This should return your type's value */
  }

  getReadableValue(value) {
    /* Here you should convert the given value to a stringified version which will be displayed to the end user */
  }

  disable(status) {
    /* You should enable or disable your type (make it visible in your markup) depending on the given status */
  }

  onDestroy() {
    /* Here you must clean your type, removing event listeners and so on. Your markup will be automatically cleaned for you */
    /* This method can also return a Promise */
  }
}
````

### Registering it
To make Scribio aware of your new type, you can simply register it like so:
````js
Scribio.registerType('myType', typeClass, someConfig);
````

Where:
- myType is your type name, it will be used when spanning new instances
- typeClass is the class of your type
- someConfig, you can eventually pass some config here. This is used if you register a third-party type and want to override default configuration on type registration.

## Creating your own renderer
Creating a renderer is a bit more complex than creating a type, but fear not, it remains quite easy.
A renderer is responsible to display the type once an edit session is triggered.

### Creating your class
Creating a renderer implies creating a class for it. Here is the default skeleton:

````js
export default class {
  constructor(instance, config = {}) {
    /* Constructor which receives the Scribio instance and given config */
  }

  init() {
    /* This can be used to initialize the renderer, it is called right after it was instanciated. For example in the Popup renderer it is used to parse the markup, attach event listeners and initialize Popper.js. It can return a Promise. */
  }

  error(error) {
    /* This should display the given error string somewhere in your renderer */
  }

  show(markup) {
    /* This is called right after init has finished resolving, in the popup renderer it is used to handle transition. You must insert the given markup (type, actions...) in your renderer */
  }

  loading(status) {
    /* This should display a visual element indicating if a job is running or not depending on the given status */
  }

  destroy() {
    /* This should completely destroy your renderer, clean event listeners and markup. It can return a promise */
  }
}
````

### Registering your renderer
Once your renderer is ready, you can easily register it:

````js
Scribio.registerRenderer('myRenderer', rendererClass, someConfig);
````

Where:
- myRenderer is your renderer name, it will be used when spanning new instances
- rendererClass is the class of your renderer
- someConfig, you can eventually pass some config here. This is used if you register a third-party renderer and want to override default configuration on registration.

## Creating theme
Scribio supports global modifiers by the mean of themes. A theme is, in the end, simply a big configuration object. You can
override configuration for everything in a theme. It still differs a little bit from the standard default configuration. Here is a basic theme:
````js
export default {
  types: [
    {
      name: 'text',
      config: { /* text type config */},
    },
  ],
  renderers: [
    {
      name: 'popup',
      config: { /* popup renderer config */},
    },
  ],
  config: {
    /* Global config */
  }, 
}
````

As you can see, a theme can override configuration per type and renderer, as well as override any global configuration
option. You don't have to override everything, only the parts you want. The configuration tree is then progressively merged
as detailed in the next section.

## How configuration is handled
Scribio is based on a lot of configuration options. Here is the order in which it is merged:
- *Default configuration*, first we take the base configuration object given to have all properties defined
- *Loaded configuration*, only for types and renderers, we first merge it with the configuration given on registration
- *Theme configuration*, we iterate over each theme by order of registration and merge it
- *Spanning configuration*, we finish by merging it with the configuration given on a `Scribio.span(node, config)`

### Configuration flattening
For Scribio core types and renderers as well as instance configuration, the whole tree is flattened to a one level object.
Objets like `{ handler: { onSubmit: fn } }` become `{ 'handler.onSubmit': fn }`.

### Configuration functions
Each configuration option has a type (number, string, function as detailed in the upper section), but can also be a function returning a value
of the given type (except for functions as explained in the section below). As such, for each detected function, we bind
the `this` to an object, for the instance configuration it is the instance itself, for a renderer it is the renderer itself
and the same goes for the type.

### Reading configuration
If you need to read the instance, type or renderer's configuration once you have access to it, you can
do it by the following: 
````js
instance.config('config.key')
````
If the config value you expect is a function you wish to call, you rather have to retrieve it like this:
````js
instance.config.fn('config.key')
````

## License
This code is licensed under the MIT license
