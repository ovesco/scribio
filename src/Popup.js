import Popper from 'popper.js';
import merge from 'merge';

const ARIA_POPUP_CONTAINER = 'aria-popup-container';

class Popup {
  constructor(instance, popupConfig) {
    const markup = instance.getEditMarkup();
    this.markup = instance.parseMarkup(popupConfig.popupMarkup);
    this.markup.appendChild(markup);
    this.instance = instance;
    this.popper = null;
    this.listener = (e) => {
      if (this.popper === null) return;
      if (this.markup.contains(e.target)) return;
      if (instance.readModeContainer.contains(e.target)) return;
      instance.closeEditMode();
    };
  }

  show() {
    if (this.popper !== null) return;
    document.body.append(this.markup);
    this.popper = new Popper(this.instance.readModeContainer, this.markup);
    document.addEventListener('click', this.listener, true);
  }

  hide() {
    if (this.popper === null) return;
    this.popper.destroy();
    this.markup.remove();
    this.markup = null;
    this.popper = null;
    document.removeEventListener('click', this.listener, true);
  }
}

export default class {
  constructor(config = {}) {
    const defaultConfig = {
      popupMarkup: () => `<div class="scribio-popup" ${ARIA_POPUP_CONTAINER}></div>`,
    };
    this.config = merge(defaultConfig, config);
  }

  getRenderable(instance) {
    return new Popup(instance, this.config);
  }
}
