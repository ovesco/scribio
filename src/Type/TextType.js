/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import merge from 'merge';

import { resolveConfig } from "../Util";

const ARIA_TEXT_INPUT = 'aria-scribio-text-input';

export const defaultConfig = {
  class: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
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
    return `<div><input type="text" ${ARIA_TEXT_INPUT} class="${this.config('class')}"></div>`;
  }
}
