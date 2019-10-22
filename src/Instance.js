import { resolveConfig, parseTemplateAsync, parseTemplate } from './Util';
import {
  ARIA_READ_ELEMENT,
  ARIA_EDIT_CONTAINER,
  ARIA_SUBMIT_BTN,
  ARIA_CANCEL_BTN, ARIA_ACTION_CONTAINER,
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
    this.type.onChange(() => null);
    const renderSession = this.renderer(this);
    renderSession.loading(true);
    parseTemplateAsync(this.config('template.edit')).then((markup) => {
      parseTemplateAsync(this.config('template.buttons')).then((buttonsMarkup) => {
        parseTemplateAsync(this.type.getTemplate()).then((typeMarkup) => {
          if (this.config('handler.mode') === 'button') {
            buttonsMarkup.querySelector(`[${ARIA_SUBMIT_BTN}]`).addEventListener('click', () => this.submit());
            buttonsMarkup.querySelector(`[${ARIA_CANCEL_BTN}]`).addEventListener('click', () => this.close());
            markup.querySelector(`[${ARIA_ACTION_CONTAINER}]`).appendChild(buttonsMarkup);
          } else {
            this.type.onChange(() => { this.submit(); });
          }
          markup.querySelector(`[${ARIA_EDIT_CONTAINER}]`).appendChild(typeMarkup);
          renderSession.show(markup);
          this.type.onDisplay(typeMarkup, this.value);
          renderSession.loading(false);
          this.renderSession = { renderer: renderSession, markup, typeMarkup };
        });
      });
    });
  }

  submit() {
    if (this.renderSession === null) return;
    const { markup } = this.renderSession;
    this.loading(true);
    const value = this.type.getInputValue(markup.querySelector(`[${ARIA_EDIT_CONTAINER}]`));
    if (value === this.value) this.close();
    else if (this.config('handler.validate')(value) !== true) {
      this.submitError(new Error('Invalid value provided'));
      this.loading(false);
    } else {
      const handler = this.config('handler.onSubmit');
      handler(value, (newValue) => {
        this.value = newValue;
        this.refreshContent();
        this.close();
      }, (error) => {
        this.submitError(error);
        this.loading(false);
      });
    }
  }

  loading(status) {
    if (this.renderSession === null) return;
    this.config('handler.onLoading')(status);
    const { renderer, markup, typeMarkup } = this.renderSession;
    renderer.loading(status);
    markup.querySelector(`[${ARIA_CANCEL_BTN}]`).disabled = status;
    markup.querySelector(`[${ARIA_SUBMIT_BTN}]`).disabled = status;
    this.type.disable(typeMarkup, status);
  }

  submitError(error) {
    if (this.renderSession === null) return;
    const { renderer } = this.renderSession;
    this.config('handler.onError')(error, () => {
      renderer.error(this.config('handler.errorDisplay')(error));
      renderer.loading(false);
    });
  }

  close() {
    if (this.renderSession === null) return;
    this.renderSession.renderer.destroy();
    this.renderSession = null;
  }

  refreshContent() {
    const { value, ariaElement } = this;
    let markup = this.config('voidDisplay');
    if (this.config('emptyValue') !== value) {
      markup = this.type.getReadableValue(value);
    }
    ariaElement.innerHTML = markup;
  }
}
