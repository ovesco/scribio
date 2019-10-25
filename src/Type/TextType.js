/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import { resolveConfig, parseTemplate } from '../Util';

const ARIA_TEXT_INPUT = 'aria-scribio-text-input';

const defaultConfig = {
  class: '',
  type: 'text',
  attributes: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    this.instance = instance;
    this.markup = null;
    this.rootNode = null;
  }

  init() {
    return null;
  }

  show(rootNode, value) {
    this.rootNode = rootNode;
    this.rootNode = rootNode;
    const markup = parseTemplate(this.getTemplate());
    markup.querySelector(`[${ARIA_TEXT_INPUT}]`).value = value;
    this.markup = markup;
    this.rootNode.appendChild(markup);
  }

  getInputValue() {
    const { value } = this.markup.querySelector(`[${ARIA_TEXT_INPUT}]`);
    return value.trim() === '' ? this.instance.config('emptyValue') : value;
  }

  getReadableValue(value) {
    return value;
  }

  disable(status) {
    this.markup.querySelector(`[${ARIA_TEXT_INPUT}]`).disabled = status;
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    const type = this.config('type');
    const tag = type === 'textarea' ? type : 'input';
    return `<div><${tag} ${this.config('attributes')} type="${this.config('type')}" ${ARIA_TEXT_INPUT} class="${this.config('class')}" /></div>`;
  }
}
