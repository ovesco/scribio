import { resolveConfig, parseTemplate } from './Util';
import { ARIA_READ_ELEMENT } from './DefaultConfig';

import Session from './Session';

export default class {
  constructor(rootContainer, type, renderer, config = {}) {
    this.config = resolveConfig(config, this);
    this.target = rootContainer;
    this.ariaElement = this.buildContainer();
    this.createType = () => type(this);
    this.createRenderer = () => renderer(this);
    this.value = this.config('currentValue');
    this.session = null;
    this.refreshContent();
  }

  buildContainer() {
    const markup = parseTemplate(this.config('template.read'));
    const ariaElement = markup.querySelector(`[${ARIA_READ_ELEMENT}]`);
    ariaElement.addEventListener('click', () => {
      this.open();
    });
    this.target.append(markup);
    return ariaElement;
  }

  setNewValue(value) {
    this.value = value;
    this.refreshContent();
  }

  open() {
    if (this.session !== null) return this.session;
    this.session = new Session(this);
    this.session.open();
    return this.session;
  }

  close() {
    if (this.session === null) return;
    this.session.destroySession();
    this.session = null;
  }

  refreshContent() {
    const { value, ariaElement } = this;
    if (this.config('emptyValue') !== value) {
      Promise.resolve(this.config('valueDisplay')(value)).then((markup) => {
        ariaElement.innerHTML = markup;
      });
    } else {
      ariaElement.innerHTML = this.config('voidDisplay');
    }
  }
}
