/* eslint-disable class-methods-use-this */
import merge from 'deepmerge';

import BaseChoiceType from './BaseChoiceType';

const ARIA_SELECT = 'aria-select-field';

const defaultConfig = {
  multiple: false,
  dataSource: () => [],
  class: '',
};

export default class extends BaseChoiceType {
  constructor(instance, givenConfig = {}) {
    super(instance, merge(defaultConfig, givenConfig), ARIA_SELECT);
  }

  show(rootNode, value) {
    return this.internalShow(rootNode, value, (markup) => {
      const values = (!this.config('multiple')) ? [value] : value;
      values.forEach((v) => {
        const select = markup.querySelector(`[${ARIA_SELECT}]`);
        [...select.options].find((it) => `${it.value}` === `${v}`).selected = true;
      });
    });
  }

  getInputValue() {
    const { markup } = this;
    const select = markup.querySelector(`[${ARIA_SELECT}]`);
    if (!this.config('multiple')) return select.value;
    const values = [...select.options].filter((o) => o.selected).map((o) => o.value);
    return values.length > 0 ? values : this.instance.config('emptyValue');
  }

  getReadableValue(value) {
    if (!this.config('multiple')) return this.source.find((it) => `${it.value}` === `${value}`).text;
    return super.getReadableValue(value);
  }

  getTemplate() {
    return new Promise((resolve) => {
      let html = `<div><select class="${this.config('class')}" ${ARIA_SELECT}>`;
      html += this.source.map(({ text, value }) => `<option value="${value}">${text}</option>`).join('');
      html += '</select></div>';
      resolve(html);
    });
  }
}
