import Popper from 'popper.js';

export default class {
  constructor(instance) {
    const markup = instance.getEditMarkup();
    this.markup = instance.parseMarkup('<div class="scribio-popup"></div>');
    this.markup.appendChild(markup);
    this.instance = instance;
    this.popper = null;
  }

  show() {
    if (this.popper !== null) return;

  }

  hide() {

  }
}
