import { ARIA_POPUP_CONTAINER, ARIA_POPUP_ERROR, ARIA_POPUP_TITLE } from '../Renderer/PopupRenderer';
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
        popupTemplate: `
<div class="popover fade show bs-popover-top">
    <h3 class="popover-header ${ARIA_POPUP_TITLE}"></h3>
    <div class="popover-body">
        <div ${ARIA_POPUP_CONTAINER}></div>
        <div class="text-error" ${ARIA_POPUP_ERROR}></div>
    </div>
</div>`,
      },
    },
  ],
  config: {
    template: {
      edit: `
<div>
    <div class="scribio-edit-container d-flex">
        <div ${ARIA_EDIT_CONTAINER} class="mr-2"></div>
        <div ${ARIA_ACTION_CONTAINER}>
            <div class="btn-group">
                <button type="button" class="btn btn-primary btn-${size}" ${ARIA_SUBMIT_BTN}>Ok</button>
                <button type="button" class="btn btn-light btn-${size}" ${ARIA_CANCEL_BTN}>Cancel</button>
            </div>
        </div>
    </div>
</div>`,
    },
  },
});
