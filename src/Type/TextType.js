/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'deepmerge';

import { resolveConfig } from '../Util';

const ARIA_TEXT_INPUT = 'aria-scribio-text-input';

const defaultConfig = {
  class: '',
  type: 'text',
  attributes: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    console.log(this.config('class'));
    this.instance = instance;
  }

  getInputValue(rootNode) {
    return rootNode.querySelector(`[${ARIA_TEXT_INPUT}]`).value;
  }

  getReadableValue(value) {
    return value;
  }

  onDisplay(rootNode, value) {
    rootNode.querySelector(`[${ARIA_TEXT_INPUT}]`).value = value;
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    return `<div><input ${this.config('attributes')} type="${this.config('type')}" ${ARIA_TEXT_INPUT} class="${this.config('class')}"></div>`;
  }
}
