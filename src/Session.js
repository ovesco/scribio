import { parseTemplateAsync } from './Util';
import {
  ARIA_SUBMIT_BTN,
  ARIA_CANCEL_BTN,
  ARIA_ACTION_CONTAINER,
  ARIA_EDIT_CONTAINER,
} from './DefaultConfig';

export default class {
  constructor(instance) {
    this.config = instance.config;
    this.instance = instance;
    this.type = instance.createType();
    this.renderer = instance.createRenderer();
    this.markup = null;
  }

  open() {
    return new Promise((resolve) => {
      Promise.resolve(this.renderer.init()).then(() => {
        this.renderer.loading(true);
        parseTemplateAsync(this.config('template.edit')).then((editMarkup) => {
          parseTemplateAsync(this.config('template.buttons')).then((buttonsMarkup) => {
            if (this.config('buttons.enabled')) {
              const submitBtn = buttonsMarkup.querySelector(`[${ARIA_SUBMIT_BTN}]`);
              const cancelBtn = buttonsMarkup.querySelector(`[${ARIA_CANCEL_BTN}]`);
              submitBtn.addEventListener('click', () => this.submit());
              cancelBtn.addEventListener('click', () => {
                this.cancel();
              });
              submitBtn.innerHTML = this.config('buttons.submitText');
              cancelBtn.innerHTML = this.config('buttons.cancelText');
              editMarkup.querySelector(`[${ARIA_ACTION_CONTAINER}]`).appendChild(buttonsMarkup);
            }
            this.markup = editMarkup;

            // Init type
            Promise.resolve(this.type.init()).then(() => {
              Promise.resolve(this.type.show(this.markup.querySelector(`[${ARIA_EDIT_CONTAINER}]`), this.instance.value)).then(() => {
                this.renderer.show(this.markup);
                this.renderer.loading(false);
                resolve();
              });
            });
          });
        });
      });
    });
  }

  cancel() {
    this.setLoading(true);
    Promise.resolve(this.config('handler.onCancel')).then(() => {
      this.setLoading(false);
      this.instance.close();
    });
  }

  setLoading(status) {
    this.config('handler.onLoading')(status);
    this.renderer.loading(status);
    this.type.disable(status);
    if (this.config('buttons.enabled')) {
      this.markup.querySelector(`[${ARIA_CANCEL_BTN}]`).disabled = status;
      this.markup.querySelector(`[${ARIA_SUBMIT_BTN}]`).disabled = status;
    }
  }

  error(error) {
    this.config('handler.onError')(error, (e) => {
      this.renderer.error(this.config('handler.errorDisplay')(e));
    });
  }

  submit() {
    this.setLoading(true);
    const value = this.type.getInputValue();
    if (value === this.instance.value) this.instance.close();
    else if (this.config('handler.validate')(value) !== true) {
      this.error(new Error('Invalid value provided'));
      this.setLoading(false);
    } else {
      this.config('handler.onSubmit')(value, (newValue) => {
        this.instance.setNewValue(newValue);
        this.instance.close();
      }, (error) => {
        this.error(error);
        this.setLoading(false);
      });
    }
  }

  destroySession() {
    return new Promise((resolve) => {
      Promise.resolve(this.type.onDestroy()).then(() => {
        Promise.resolve(this.renderer.destroy()).then(() => {
          this.renderer = null;
          this.type = null;
          this.markup.remove();
          resolve();
        });
      });
    });
  }
}
