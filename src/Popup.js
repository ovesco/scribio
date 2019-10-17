import Popper from 'popper.js';
import merge from 'merge';

const ARIA_POPUP_CONTAINER = 'aria-popup-container';
const ARIA_ERROR_CONTAINER = 'aria-error-container';

class Popup {
  constructor(instance, config) {
    this.config = config;
    this.instance = instance;
    this.markup = null;
    this.popper = null;
    this.listener = (e) => {
      if (this.popper === null || this.markup === null) return;
      if (this.markup.contains(e.target)) return;
      if (instance.readModeContainer.contains(e.target)) return;
      instance.closeEditMode();
    };

    document.addEventListener('click', this.listener, true);
  }

  getMarkup() {
    return this.markup;
  }

  show() {
    if (this.popper !== null) return;
    const { instance, config } = this;
    const markup = instance.getEditMarkup();
    this.markup = instance.parseMarkup(config.popupMarkup);
    this.markup.appendChild(markup);

    document.body.append(this.markup);
    this.popper = new Popper(this.instance.readModeContainer, this.markup);
  }

  hide() {
    if (this.popper === null) return;
    this.popper.destroy();
    this.markup.remove();
    this.markup = null;
    this.popper = null;
  }

  showError(error) {
    this.markup.querySelector(`[${ARIA_ERROR_CONTAINER}]`).innerHTML = error;
  }

  clearError() {
    const errorContainer = this.markup.querySelector(`[${ARIA_ERROR_CONTAINER}]`);
    while (errorContainer.firstChild) errorContainer.removeChild(errorContainer.firstChild);
  }

  destroy() {
    this.hide();
    document.removeEventListener('click', this.listener, true);
  }
}

export default class {
  constructor(config = {}) {
    const defaultConfig = {
      popupMarkup: () => '<div class="scribio-popup">'
          + `<div ${ARIA_POPUP_CONTAINER}></div>`
          + `<div ${ARIA_ERROR_CONTAINER}></div>`
          + '</div>',
    };
    this.config = merge(defaultConfig, config);
  }

  getRenderable(instance) {
    return new Popup(instance, this.config);
  }
}
