/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import { resolveConfig } from '../Util';

const ARIA_SELECT = 'aria-select-field';

const options = [];
for (let i = 0; i < 10; i++) options.push({ value: i, text: `option-${i}` });

const defaultConfig = {
  multiple: true,
  dataSource: options,
  class: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    this.instance = instance;
    this.source = [];
  }

  getInputValue(rootNode) {
    const select = rootNode.querySelector(`[${ARIA_SELECT}]`);
    if (!this.config('multiple')) return select.value;
    return [...select.options].filter((o) => o.selected).map((o) => o.value);
  }

  getReadableValue(value) {
    if (!this.config('multiple')) return this.source.find((it) => `${it.value}` === `${value}`).text;
    return value.map((v) => this.source.find((it) => `${it.value}` === `${v}`).text).join(', ');
  }

  onDisplay(rootNode, value) {
    rootNode.querySelector(`[${ARIA_SELECT}]`).value = value;
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    return new Promise((resolve) => {
      Promise.resolve(this.config('dataSource')).then((data) => {
        this.source = data;
        const select = document.createElement('select');
        const cls = this.config('class');
        if (!['', null, undefined].includes(cls)) select.classList.add(cls);
        select.setAttribute(ARIA_SELECT, '');
        if (this.config('multiple')) select.setAttribute('multiple', '1');
        data.forEach(({ value, text }) => {
          const option = document.createElement('option');
          option.setAttribute('value', value);
          option.innerHTML = text;
          select.appendChild(option);
        });
        setTimeout(() => {
          resolve(select);
        }, 1000);
      });
    });
  }
}
