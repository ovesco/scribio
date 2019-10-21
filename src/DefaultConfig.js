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
  emptyValues: [null, '', undefined],
  currentValue: null,
  voidDisplay: 'Empty',
  handler: {
    onSubmit(value, onSuccess, onError) {
      /*
      fetch(this.config('server.url'), merge(this.config('server.requestParams'), { value }))
        .then((res) => res.json())
        .then(() => onSuccess(value))
        .catch((error) => onError(error));
       */
      setTimeout(() => {
        if (Math.random() > 0.00001) onSuccess(value);
        else onError(new Error('Server error labite'));
      });
    },
    errorDisplay(error) {
      return error.message;
    },
    validate() {
      return true;
    },
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
    <span ${ARIA_READ_ELEMENT}></span>
</div>`,
  },
};
