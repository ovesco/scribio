import merge from 'merge';

const ARIA_EDIT_CONTAINER = 'aria-scribio-edit-container';
const ARIA_ACTION_CONTAINER = 'aria-scribio-action-container';
const ARIA_READ_ELEMENT = 'aria-scribio-read-element';

const ARIA_SUBMIT_BTN = 'aria-scribio-submit-btn';
const ARIA_CANCEL_BTN = 'aria-scribio-cancel-btn';

export {
  ARIA_ACTION_CONTAINER,
  ARIA_EDIT_CONTAINER,
  ARIA_READ_ELEMENT,
  ARIA_CANCEL_BTN,
  ARIA_SUBMIT_BTN,
};

export default {
  type: {
    name: 'text',
    config: {},
  },
  renderer: {
    name: 'popup',
    config: {},
  },
  server: {
    url: null,
    requestParams: {},
  },
  voidValue: null,
  currentValue: null,
  voidDisplay: 'Empty',
  handler: {
    onSubmit: (value, onSuccess, onError) => {
      const { server } = this.config;
      fetch(this.resolve(server.url), merge(this.resolve(server.requestParams, { value })))
        .then((res) => res.json())
        .then(() => onSuccess(value))
        .catch((error) => onError(error));
    },
    validate: (value) => value,
  },
  template: {
    edit: `
<div class="scribio-edit-container">
    <div ${ARIA_EDIT_CONTAINER}></div>
    <div ${ARIA_ACTION_CONTAINER}>
        <div class="scribio-buttons-container">
          <button ${ARIA_SUBMIT_BTN}>Ok</button>
          <button ${ARIA_CANCEL_BTN}>Cancel</button>
      </div>
    </div>
</div>`,
    read: `
<div class="scribio-read-container">
    <div ${ARIA_READ_ELEMENT}></div>
</div>`,
  },
};
