const ARIA_EDIT_CONTAINER = 'aria-scribio-edit-container';
const ARIA_ACTION_CONTAINER = 'aria-scribio-action-container';
const ARIA_READ_ELEMENT = 'aria-scribio-read-element';
const ARIA_LOADING_CONTAINER = 'aria-loading-container';

const ARIA_SUBMIT_BTN = 'aria-scribio-submit-btn';
const ARIA_CANCEL_BTN = 'aria-scribio-cancel-btn';

export {
  ARIA_ACTION_CONTAINER,
  ARIA_EDIT_CONTAINER,
  ARIA_READ_ELEMENT,
  ARIA_CANCEL_BTN,
  ARIA_SUBMIT_BTN,
  ARIA_LOADING_CONTAINER,
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
  trigger: 'click', // 'hover', 'none'
  emptyValue: null,
  currentValue: null,
  voidDisplay: 'Empty',
  valueDisplay(value) {
    if (this.session !== null) return this.session.type.getReadableValue(value);
    return new Promise((resolve) => {
      const type = this.createType();
      Promise.resolve(type.init()).then(() => {
        resolve(type.getReadableValue(value));
      });
    });
  },
  handler: {
    onOpen(forward) {
      forward();
    },
    onClose(forward) {
      forward();
    },
    onSubmit(value, onSuccess, onError) {
      fetch(this.config('server.url'), { ...this.config('server.requestParams'), value })
        .then((res) => res.json())
        .then(() => onSuccess(value))
        .catch((error) => onError(error));
    },
    onError(error, forward) {
      forward(error);
    },
    onCancel(forward) {
      forward();
    },
    onLoading: () => null,
    errorDisplay(error) {
      return error.message;
    },
    validate() {
      return true;
    },
  },
  buttons: {
    enabled: true,
    submitText: 'Ok',
    cancelText: 'Cancel',
  },
  template: {
    edit: `
<div class="scribio-edit-container">
    <div ${ARIA_EDIT_CONTAINER}></div>
    <div ${ARIA_ACTION_CONTAINER}></div>
</div>`,
    buttons: `
<div class="scribio-buttons-container">
    <button ${ARIA_SUBMIT_BTN}>Ok</button>
    <button ${ARIA_CANCEL_BTN}>Cancel</button>
</div>`,
    read: `
<div class="scribio-read-container">
    <span ${ARIA_READ_ELEMENT}></span>
    <div ${ARIA_LOADING_CONTAINER}></div>
</div>`,
    loading: `
<div>Loading</div>`,
  },
};
