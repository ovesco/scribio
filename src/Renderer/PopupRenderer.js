import merge from 'deepmerge';
import Popper from 'popper.js';

import {
  resolveConfig,
  parseTemplate,
  emptyContent,
} from '../Util';

const ARIA_POPUP_ARROW = 'aria-scribio-popup-arrow';
const ARIA_POPUP_TITLE = 'aria-scribio-popup-title';
const ARIA_POPUP_CONTAINER = 'aria-scribio-popup-container';
const ARIA_POPUP_ERROR = 'aria-popup-error';
const ARIA_POPUP_LOADING = 'aria-popup-loading';

export {
  ARIA_POPUP_TITLE,
  ARIA_POPUP_CONTAINER,
  ARIA_POPUP_ERROR,
  ARIA_POPUP_ARROW,
  ARIA_POPUP_LOADING,
};

const defaultConfig = {
  popperConfig: {
    placement: 'right',
    positionFixed: true,
  },
  popupTemplate: `
<div class="scribio-popup">
    <div class="scribio-popup-arrow" ${ARIA_POPUP_ARROW}></div>
    <div class="scribio-popup-title" ${ARIA_POPUP_TITLE}></div>
    <div class="scribio-popup-container" ${ARIA_POPUP_CONTAINER}></div>
    <div class="scribio-popup-loading" ${ARIA_POPUP_LOADING}>Loading</div>
    <div class="scribio-popup-error" ${ARIA_POPUP_ERROR}></div>
</div>
`,
};

export default class {
  constructor(instance, config = {}) {
    this.instance = instance;
    this.rawConfig = merge(defaultConfig, config);
    this.config = resolveConfig(this.rawConfig, this);
  }

  init() {
    return new Promise((resolve) => {
      this.markup = parseTemplate(this.config('popupTemplate'));
      this.isLoading = true;

      this.listener = (e) => {
        if (this.isLoading) return;
        if (this.popper === null || this.markup === null) return;
        if (this.markup.contains(e.target)) return;
        if (this.instance.ariaElement.contains(e.target)) return;
        this.instance.close();
      };

      // Show popup
      document.addEventListener('click', this.listener, true);
      document.body.append(this.markup);
      // eslint-disable-next-line
      this.popper = new Popper(this.instance.ariaElement, this.markup, merge(this.rawConfig.popperConfig, {
        modifiers: {
          arrow: {
            element: `[${ARIA_POPUP_ARROW}]`,
          },
        },
      }));
      resolve();
    });
  }

  error(error) {
    const container = this.markup.querySelector(`[${ARIA_POPUP_ERROR}]`);
    emptyContent(container);
    container.innerHTML = error;
  }

  show(markup) {
    const container = this.markup.querySelector(`[${ARIA_POPUP_CONTAINER}]`);
    emptyContent(container);
    container.appendChild(markup);
    this.popper.scheduleUpdate();
  }

  loading(status) {
    if (this.isLoading === status) return;
    const loadingContainer = this.markup.querySelector(`[${ARIA_POPUP_LOADING}]`);
    if (loadingContainer === null) return;
    loadingContainer.style.display = status ? '' : 'none';
    this.isLoading = status;
  }

  destroy() {
    this.loading(false);
    document.removeEventListener('click', this.listener, true);
    this.markup.remove();
    this.popper.destroy();
    this.markup = null;
    this.popper = null;
  }
}
