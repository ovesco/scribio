import { parseTemplate } from '../Util';

import {
  ARIA_POPUP_CONTAINER,
  ARIA_POPUP_ERROR,
  ARIA_POPUP_TITLE,
  ARIA_POPUP_ARROW,
  ARIA_POPUP_LOADING,

} from '../Renderer/PopupRenderer';
import {
  ARIA_EDIT_CONTAINER,
  ARIA_ACTION_CONTAINER,
  ARIA_SUBMIT_BTN,
  ARIA_CANCEL_BTN,
} from '../DefaultConfig';

export default (size = 'md') => ({
  types: [
    {
      name: 'text',
      config: {
        class: `form-control form-control-${size}`,
      },
    },
    {
      name: 'select',
      config: {
        class: `form-control form-control-${size}`,
      },
    },
    {
      name: 'checkbox',
      config: {
        labelClass: 'form-check-label',
      },
    },
    {
      name: 'radio',
      config: {
        labelClass: 'form-check-label',
      },
    },
  ],
  renderers: [
    {
      name: 'popup',
      config: {
        popupTemplate() {
          return `
<div class="popover fade show bs-popover-${this.config('popperConfig.placement')}">
    <div class="arrow" ${ARIA_POPUP_ARROW}></div>
    <h3 class="popover-header ${ARIA_POPUP_TITLE}"></h3>
    <div class="popover-body">
        <div ${ARIA_POPUP_CONTAINER}></div>
        <div class="invalid-feedback d-block" ${ARIA_POPUP_ERROR}></div>
    </div>
</div>`;
        },
      },
    },
  ],
  config: {
    handler: {
      onError(error, forward) {
        const { markup } = this.renderSession;
        [...markup.querySelectorAll('input'), ...markup.querySelectorAll('textarea')].forEach((input) => {
          input.classList.add('is-invalid');
        });
        forward();
      },
      onLoading(status) {
        const { markup } = this.renderSession;
        const btn = markup.querySelector(`[${ARIA_SUBMIT_BTN}]`);
        if (status) {
          btn.insertAdjacentElement('afterbegin', parseTemplate(`<span class="spinner-border mr-1 spinner-border-${size}" role="status" aria-hidden="true"></span>`));
        } else {
          btn.removeChild(btn.firstChild);
        }
      },
    },
    template: {
      edit: `
<div>
    <div class="scribio-edit-container d-flex">
        <div ${ARIA_EDIT_CONTAINER} class="mr-2"></div>
        <div ${ARIA_ACTION_CONTAINER}></div>
        <div ${ARIA_POPUP_LOADING}></div>
    </div>
</div>`,
      buttons: `
<div class="btn-group">
    <button type="button" class="btn btn-primary btn-${size}" ${ARIA_SUBMIT_BTN}>Ok</button>
    <button type="button" class="btn btn-light btn-${size}" ${ARIA_CANCEL_BTN}>Cancel</button>
</div>`,
    },
  },
});
