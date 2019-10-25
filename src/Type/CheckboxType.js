/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import BaseChoiceType from './BaseChoiceType';

const CHECKBOX_NAME = 'scribio-checkbox-type';

const defaultConfig = {
  dataSource: [],
  containerClass: '',
  checkboxClass: '',
  labelClass: '',
  displaySeparator: ', ',
};

export default class extends BaseChoiceType {
  constructor(instance, givenConfig = {}) {
    super(instance, merge(defaultConfig, givenConfig), CHECKBOX_NAME);
  }

  show(rootNode, value) {
    return this.internalShow(rootNode, value, (markup) => {
      const checkboxs = [...markup.querySelectorAll(`[name="${CHECKBOX_NAME}"]`)];
      value.forEach((v) => {
        checkboxs.find((it) => `${it.value}` === `${v}`).checked = true;
      });
    });
  }

  getInputValue() {
    const { markup } = this;
    const values = [...markup.querySelectorAll(`[name="${CHECKBOX_NAME}"]`)]
      .filter((it) => it.checked).map((it) => it.value);
    return values.length > 0 ? values : this.instance.config('emptyValue');
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
