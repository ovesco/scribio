import merge from 'merge';

import PopupRenderer from './Popup';

const ELEMENT_CONTAINER_CLASS = 'scribio-element-container';
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
      renderer: new PopupRenderer(),
      validate: (/* value, instance */) => true,
      errorDisplay: (error) => error,
      server: {
        url: null,
        requestParams: {},
        submit: (value, onSuccess, onError) => {
          const { server } = this.config;
          fetch(this.resolveFunction(server.url), merge({ value },
            this.resolveFunction(server.requestParams))).then((res) => res.json())
            .then(() => onSuccess(value))
            .catch((error) => onError(error));
        },
      },
      editMarkup: (/* instance */) => '<div class="scribio-edit">'
          + `<div class="scribio-edit-container"><div class="${INPUT_CONTAINER_CLASS}"></div><div class="${BUTTONS_CONTAINER_CLASS}"></div></div>`
          + '</div>',
      readModeMarkup: (/* instance */) => '<div class="scribio-element">'
          + `<span class="${ELEMENT_CONTAINER_CLASS}"></span>`
          + '</div>',
      buttonsEditMarkup: (/* instance */) => '<div>'
          + `<button class="${VALIDATE_BUTTON_CLASS}">Ok</button>`
          + `<button class="${CANCEL_BUTTON_CLASS}">Cancel</button>`
          + '</div>',
    };

    this.config = merge(config, defaultConfig);
    this.type = new Type(this);
    this.container = container;
    this.renderable = this.config.renderer.getRenderable(this);
    this.readModeContainer = this.buildReadContainer();
    this.value = this.config.value;

    this.refreshReadModeValue();
  }

  buildReadContainer() {
    const { container } = this;
    const readMarkup = this.parseMarkup(this.config.readModeMarkup);
    container.appendChild(readMarkup);
    const readContainer = container.querySelector(`.${ELEMENT_CONTAINER_CLASS}`);
    readContainer.addEventListener('click', () => {
      this.openEditMode();
    });
    return readContainer;
  }

  submitForm() {
    const value = this.type.getInputValue(this.renderable.getMarkup());
    this.renderable.showError('Une jolie erreur');
    setTimeout(() => {
      this.renderable.clearError();
    }, 2000);
    if (this.config.validate(value, this)) {
      this.config.server.submit(value, (newValue) => {
        this.value = newValue;
        this.refreshReadModeValue();
        this.closeEditMode();
      }, (error) => {

      });
    } else {
      console.log('ERROR');
      // do sth
    }
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
    const buttonsMarkup = this.parseMarkup(this.config.buttonsEditMarkup);
    const typeMarkup = this.parseMarkup(this.type.getMarkup());

    // Append listeners
    buttonsMarkup.querySelector(`.${VALIDATE_BUTTON_CLASS}`).onclick = () => this.submitForm();
    buttonsMarkup.querySelector(`.${CANCEL_BUTTON_CLASS}`).onclick = () => this.closeEditMode();

    // Add sub markup
    markup.querySelector(`.${INPUT_CONTAINER_CLASS}`).appendChild(typeMarkup);
    markup.querySelector(`.${BUTTONS_CONTAINER_CLASS}`).appendChild(buttonsMarkup);
    return markup;
  }

  openEditMode() {
    this.renderable.show();
  }

  closeEditMode() {
    this.renderable.hide();
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
