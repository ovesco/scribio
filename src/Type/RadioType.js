/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import BaseChoiceType from './BaseChoiceType';

const RADIO_NAME = 'scribio-radio-type';

const defaultConfig = {
  dataSource: [],
  containerClass: '',
  labelClass: '',
  radioClass: '',
};

export default class extends BaseChoiceType {
  constructor(instance, givenConfig = {}) {
    super(instance, merge(defaultConfig, givenConfig), RADIO_NAME);
  }

  show(rootNode, value) {
    return this.internalShow(rootNode, value, (markup) => {
      const radios = [...markup.querySelectorAll(`[name="${RADIO_NAME}"]`)];
      radios.find((it) => `${it.value}` === `${value}`).checked = true;
    });
  }

  getInputValue() {
    const radio = [...this.markup.querySelectorAll(`[name="${RADIO_NAME}"]`)]
      .filter((it) => it.checked);
    return radio.length === 1 ? radio[0].value : this.instance.config('emptyValue');
  }

  getReadableValue(value) {
    return super.getReadableValue([value]);
  }

  getTemplate() {
    return new Promise((resolve) => {
      Promise.resolve(this.config('dataSource')).then((data) => {
        this.source = data;
        let html = `<div class="${this.config('containerClass')}">`;
        html += data.map(({ text, value }) => `
<div>
    <input type="radio" id="${RADIO_NAME + value}" class="${this.config('radioClass')}" data-text="${text}" name="${RADIO_NAME}" value="${value}">
    <label class="${this.config('labelClass')}" for="${RADIO_NAME + value}">${text}</label>
</div>`).join('');
        html += '</div>';
        resolve(html);
      });
    });
  }
}
