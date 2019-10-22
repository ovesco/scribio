/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import { resolveConfig } from '../Util';

const RADIO_NAME = 'scribio-radio-type';

const defaultConfig = {
  dataSource: [],
  containerClass: '',
  labelClass: '',
  radioClass: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    this.instance = instance;
    this.source = [];
  }

  getInputValue(rootNode) {
    const radio = [...rootNode.querySelectorAll(`[name="${RADIO_NAME}"]`)]
      .filter((it) => it.checked);
    return radio.length === 1 ? radio[0].value : this.instance.config('emptyValue');
  }

  getReadableValue(value) {
    return this.source.find((it) => `${it.value}` === `${value}`).text;
  }

  onDisplay(rootNode, value) {
    if (value === this.instance.config('emptyValue')) return;
    const radios = [...rootNode.querySelectorAll(`[name="${RADIO_NAME}"]`)];
    radios.find((it) => `${it.value}` === `${value}`).checked = true;
  }

  disable(rootNode, status) {
    [...rootNode.querySelectorAll(`[name="${RADIO_NAME}"]`)].forEach((radio) => { radio.disabled = status; });
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
    <input type="radio" id="${RADIO_NAME + value}" class="${this.config('radioClass')}" data-text="${text}" name="${RADIO_NAME}" value="${value}">
    <label class="${this.config('labelClass')}" for="${RADIO_NAME + value}">${text}</label>
</div>`).join('');
        html += '</div>';
        resolve(html);
      });
    });
  }
}
