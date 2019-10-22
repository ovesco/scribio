/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import { resolveConfig } from '../Util';

const CHECKBOX_NAME = 'scribio-checkbox-type';

const defaultConfig = {
  dataSource: [],
  containerClass: '',
  checkboxClass: '',
  labelClass: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    this.instance = instance;
    this.source = [];
  }

  getInputValue(rootNode) {
    const values = [...rootNode.querySelectorAll(`[name="${CHECKBOX_NAME}"]`)]
      .filter((it) => it.checked).map((it) => it.value);
    return values.length > 0 ? values : this.instance.config('emptyValue');
  }

  getReadableValue(values) {
    return values.map((v) => this.source.find((it) => `${it.value}` === `${v}`).text).join(', ');
  }

  onDisplay(rootNode, values) {
    if (values === this.instance.config('emptyValue')) return;
    const checkboxs = [...rootNode.querySelectorAll(`[name="${CHECKBOX_NAME}"]`)];
    values.forEach((v) => {
      checkboxs.find((it) => `${it.value}` === `${v}`).checked = true;
    });
  }

  disable(rootNode, status) {
    [...rootNode.querySelectorAll(`[name="${CHECKBOX_NAME}"]`)].forEach((cb) => { cb.disabled = status; });
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    return new Promise((resolve) => {
      Promise.resolve(this.config('dataSource')).then((data) => {
        this.source = data;
        let html = `<div class="${this.config('containerClass')}">`;
        html += data.map(({ text, value }) => `
<div>
    <input type="checkbox" id="${CHECKBOX_NAME + value}" class="${this.config('checkboxClass')}" data-text="${text}" name="${CHECKBOX_NAME}" value="${value}">
    <label class="${this.config('labelClass')}" for="${CHECKBOX_NAME + value}">${text}</label>
</div>`).join('');
        html += '</div>';
        resolve(html);
      });
    });
  }
}
