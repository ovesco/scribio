import { resolveConfig, parseTemplate, emptyContent } from './Util';
import { ARIA_READ_ELEMENT, ARIA_LOADING_CONTAINER } from './DefaultConfig';

import Session from './Session';

export default class {
  constructor(rootContainer, type, renderer, config = {}) {
    this.config = resolveConfig(config, this);
    this.target = rootContainer;
    this.ariaElement = this.buildContainer();
    this.createType = () => type(this);
    this.createRenderer = () => renderer(this);
    this.value = this.config('currentValue');
    this.loading = false;
    this.session = null;
    this.refreshContent();
  }

  buildContainer() {
    const markup = parseTemplate(this.config('template.read'));
    const ariaElement = markup.querySelector(`[${ARIA_READ_ELEMENT}]`);
    if (this.config('trigger') !== 'none') {
      ariaElement.addEventListener(this.config('trigger'), () => this.open(), true);
    }
    this.target.append(markup);
    return ariaElement;
  }

  setNewValue(value) {
    this.value = value;
    this.refreshContent();
  }

  setLoading(status) {
    if (this.loading === status) return;
    const loadingContainer = this.target.querySelector(`[${ARIA_LOADING_CONTAINER}]`);
    if (status) loadingContainer.appendChild(parseTemplate(this.config('template.loading')));
    else emptyContent(loadingContainer);
    this.loading = status;
  }

  open() {
    if (this.session !== null) return this.session;
    this.setLoading(true);
    this.session = new Session(this);
    Promise.resolve(this.config('handler.onOpen')).then(() => {
      this.session.open().then(() => {
        this.setLoading(false);
      });
    });
    return this.session;
  }

  destroy() {
    emptyContent(this.target);
  }

  close() {
    if (this.session === null) return;
    Promise.resolve(this.config.fn('handler.onClose')).then(() => {
      Promise.resolve(this.session.destroySession()).then(() => {
        this.session = null;
      });
    });
  }

  refreshContent() {
    const { value, ariaElement } = this;
    if (this.config('emptyValue') !== value) {
      this.setLoading(true);
      Promise.resolve(this.config.fn('valueDisplay')(value)).then((markup) => {
        ariaElement.innerHTML = markup;
        this.setLoading(false);
      });
    } else {
      ariaElement.innerHTML = this.config('voidDisplay');
    }
  }
}
