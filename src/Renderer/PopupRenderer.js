import merge from 'merge';
import Popper from 'popper.js';

import { resolveConfig, parseTemplate, emptyContent } from '../Util';

const ARIA_POPUP_TITLE = 'aria-scribio-popup-title';
const ARIA_POPUP_CONTAINER = 'aria-scribio-popup-container';
const ARIA_POPUP_ERROR = 'aria-popup-error';

const defaultConfig = {
  popupTemplate: `
<div class="scribio-popup">
    <div class="scribio-popup-title" ${ARIA_POPUP_TITLE}></div>
    <div class="scribio-popup-container" ${ARIA_POPUP_CONTAINER}></div>
    <div class="scribio-popup-error" ${ARIA_POPUP_ERROR}></div>
</div>
`,
};

class Popup {
  constructor(instance, config = {}) {
    this.instance = instance;
    this.config = resolveConfig(merge(defaultConfig, config), this);
    this.markup = parseTemplate(this.config('popupTemplate'));
    this.isLoading = true;

    this.listener = (e) => {
      if (this.popper === null || this.markup === null) return;
      if (this.markup.contains(e.target)) return;
      if (instance.readModeContainer.contains(e.target)) return;
      instance.close();
    };

    // Show popup
    document.addEventListener('click', this.listener, true);
    document.body.append(this.markup);
    this.popper = new Popper(this.instance.container, this.markup);
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
  }

  loading(status) {
    if (this.isLoading === status) return;
    console.log(`popup loading state: ${status}`);
    this.isLoading = status;
  }

  destroy() {
    document.removeEventListener('click', this.listener, true);
    this.markup.remove();
    this.popper.destroy();
    this.markup = null;
    this.popper = null;
  }
}

export default (instance, config = {}) => {
  return new Popup(instance, config);
};
