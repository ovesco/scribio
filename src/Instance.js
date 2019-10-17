import merge from 'merge';
import Popper from 'popper.js';

const INPUT_CONTAINER_CLASS = 'scribio-input-container';
const BUTTONS_CONTAINER_CLASS = 'scribio-buttons-container';
const VALIDATE_BUTTON_CLASS = 'scribio-btn-validate';
const CANCEL_BUTTON_CLASS = 'scribio-btn-cancel';

export default class {
  constructor(container, Type, config = {}) {
    // Declare default options
    const defaultConfig = {
      disabled: false,
      type: 'text',
      typeConfig: {},
      defaultValue: null,
      currentValue: null,
      valueDisplay: (value /* , instance */) => value,
      emptyValueDisplay: 'Empty',
      mode: 'popup',
      validate: (/* value, instance */) => true,
      server: {
        url: null,
        requestParams: {},
        onSubmit: (value, onSuccess, onError) => {
          const { server } = this.config;
          fetch(this.resolveFunction(server.url), merge({ value },
            this.resolveFunction(server.requestParams))).then((res) => res.json())
            .then((data) => onSuccess(data))
            .catch((error) => onError(error));
        },
      },
      editMarkup: (/* instance */) => '<div class="scribio-edit">'
          + `<div class="scribio-edit-container"><div class="${INPUT_CONTAINER_CLASS}"></div><div class="${BUTTONS_CONTAINER_CLASS}"></div></div>`
          + '</div>',
      readModeMarkup: (/* instance */) => '<div class="scribio-element">'
          + '<span class="scribio-element-container"></span>'
          + '</div>',
      buttonsMarkup: (/* instance */) => '<div>'
          + `<button class="${VALIDATE_BUTTON_CLASS}">Ok</button>`
          + `<button class="${CANCEL_BUTTON_CLASS}">Cancel</button>`
          + '</div>',
    };

    this.config = merge(config, defaultConfig);
    this.container = container;
    this.readModeContainer = this.buildReadContainer();
    this.value = this.config.value;
    this.type = new Type(this);
    this.popup = null;

    this.refreshReadModeValue();

    document.onclick = (e) => {
      if (this.popup === null) return;
      if (this.popup.markup.contains(e.target)) return;
      if (this.readModeContainer.contains(e.target)) return;
      this.closePopup();
    };
  }

  buildReadContainer() {
    const readMarkup = this.parseMarkup(this.config.readModeMarkup);
    this.container.appendChild(readMarkup);
    const readContainer = this.container.querySelector('.scribio-element-container');
    readContainer.onclick = () => {
      this.displayPopup();
    };
    return readContainer;
  }

  submitForm() {
    console.log(this.type.getInputValue(this.popup.markup));
  }

  resolveFunction(item) {
    if (typeof item === 'function') return item(this);
    return item;
  }

  parseMarkup(markup) {
    const template = this.resolveFunction(markup);
    if (template instanceof Element || template instanceof Node) return markup;
    const templateNode = document.createElement('template');
    templateNode.innerHTML = template.trim();
    return templateNode.content.firstChild;
  }

  getEditMarkup() {
    const markup = this.parseMarkup(this.config.editMarkup);
    const buttonsMarkup = this.parseMarkup(this.config.buttonsMarkup);
    const typeMarkup = this.parseMarkup(this.type.getMarkup());

    // Append listeners
    buttonsMarkup.querySelector(`.${VALIDATE_BUTTON_CLASS}`).onclick = () => this.submitForm();
    buttonsMarkup.querySelector(`.${CANCEL_BUTTON_CLASS}`).onclick = () => this.closePopup();

    // Add sub markup
    markup.querySelector(`.${INPUT_CONTAINER_CLASS}`).appendChild(typeMarkup);
    markup.querySelector(`.${BUTTONS_CONTAINER_CLASS}`).appendChild(buttonsMarkup);
    return markup;
  }

  displayPopup() {
    const markup = this.getEditMarkup();
    const { readModeContainer } = this;
    document.body.appendChild(markup);
    this.popup = { popper: new Popper(readModeContainer, markup), markup };
  }

  closePopup() {
    if (this.popup === null) return;
    const { popper, markup } = this.popup;
    popper.destroy();
    markup.remove();
    this.popup = null;
  }

  refreshReadModeValue() {
    const { value, readModeContainer } = this;
    const { valueDisplay, emptyValueDisplay } = this.config;
    const emptyValue = this.resolveFunction(emptyValueDisplay);
    const printedValue = [null, undefined].includes(value) ? emptyValue : valueDisplay(value, this);

    // Clear previous content
    while (readModeContainer.firstChild) {
      readModeContainer.removeChild(readModeContainer.firstChild);
    }

    // Write content
    if (printedValue instanceof Element) readModeContainer.appendChild(printedValue);
    else readModeContainer.innerHTML = printedValue;
  }
}
