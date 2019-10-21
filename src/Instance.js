import { resolveConfig, parseTemplateAsync, parseTemplate } from './Util';
import {
  ARIA_READ_ELEMENT,
  ARIA_EDIT_CONTAINER,
  ARIA_SUBMIT_BTN,
  ARIA_CANCEL_BTN,
} from './DefaultConfig';

export default class {
  constructor(rootContainer, type, renderer, config = {}) {
    this.config = resolveConfig(config, this);
    this.renderer = renderer;
    this.rootContainer = rootContainer;
    this.ariaElement = null;
    this.type = type(this);
    this.value = this.config('currentValue');
    this.renderSession = null;
    this.buildContainer(rootContainer);
    this.refreshContent();
  }

  buildContainer(rootContainer) {
    const markup = parseTemplate(this.config('template.read'));
    const ariaElement = markup.querySelector(`[${ARIA_READ_ELEMENT}]`);
    ariaElement.addEventListener('click', () => {
      this.open();
    });
    rootContainer.append(markup);
    this.container = markup;
    this.ariaElement = ariaElement;
  }

  open() {
    if (this.renderSession !== null) return;
    const renderSession = this.renderer(this);
    renderSession.loading(true);
    parseTemplateAsync(this.config('template.edit')).then((markup) => {
      markup.querySelector(`[${ARIA_SUBMIT_BTN}]`).addEventListener('click', () => this.submit());
      markup.querySelector(`[${ARIA_CANCEL_BTN}]`).addEventListener('click', () => this.close());
      parseTemplateAsync(this.type.getTemplate()).then((typeMarkup) => {
        markup.querySelector(`[${ARIA_EDIT_CONTAINER}]`).appendChild(typeMarkup);
        renderSession.show(markup);
        renderSession.loading(false);
        this.renderSession = { renderer: renderSession, markup };
      });
    });
  }

  submit() {
    const { renderer, markup } = this.renderSession;
    const value = this.type.getInputValue(markup.querySelector(`[${ARIA_EDIT_CONTAINER}]`));
    if (this.config('handler.validate')(value) !== true) {
      renderer.error('Invalid value provided');
    } else {
      renderer.loading(true);
      const handler = this.config('handler.onSubmit');
      handler(value, (newValue) => {
        this.value = newValue;
        this.refreshContent();
        this.close();
      }, (error) => {
        renderer.error(this.config('handler.errorDisplay')(error));
        renderer.loading(false);
      });
    }
  }

  close() {
    if (this.renderSession === null) return;
    this.renderSession.renderer.destroy();
    this.renderSession = null;
  }

  refreshContent() {
    const { value, ariaElement } = this;
    let markup = this.config('voidDisplay');
    if (!this.config('emptyValues').includes(value)) {
      markup = this.type.getReadableValue(value);
    }
    ariaElement.innerHTML = markup;
  }
}
