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
  ARIA_LOADING_CONTAINER,
  ARIA_READ_ELEMENT,
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
    <h3 class="popover-header" ${ARIA_POPUP_TITLE}></h3>
    <div class="popover-body">
        <div ${ARIA_POPUP_CONTAINER}></div>
        <div class="invalid-feedback d-block" ${ARIA_POPUP_ERROR}></div>
    </div>
</div>`;
        },
        onShow() {
          const oldPlacement = this.popper.popper.getAttribute('x-placement');
          this.popper.scheduleUpdate();
          const placement = this.popper.popper.getAttribute('x-placement');
          this.popper.popper.classList.remove(`bs-popover-${oldPlacement}`);
          this.popper.popper.classList.add(`bs-popover-${placement}`);
        },
      },
    },
  ],
  config: {
    handler: {
      onError() {
        const { markup } = this.session;
        [...markup.querySelectorAll('input'), ...markup.querySelectorAll('textarea')].forEach((input) => {
          input.classList.add('is-invalid');
        });
      },
      onLoading(status) {
        const { markup } = this.session;
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
    <button type="button" class="btn btn-primary d-flex align-items-center btn-${size}" ${ARIA_SUBMIT_BTN}>Ok</button>
    <button type="button" class="btn btn-light d-flex align-items-center btn-${size}" ${ARIA_CANCEL_BTN}>Cancel</button>
</div>`,
      read: `
<div class="scribio-read-container d-flex align-items-center">
    <span ${ARIA_READ_ELEMENT}></span>
    <div ${ARIA_LOADING_CONTAINER}></div>
</div>`,
      loading: `
<div class="ml-2"><div class="spinner-border text-primary spinner-border-${size}" role="status"></div></div>`,
    },
  },
});
