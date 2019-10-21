/* eslint-disable class-methods-use-this */

import merge from 'merge';

const ARIA_TEXT_INPUT = 'aria-text-input';

export default class {
  constructor(instance) {
    const defaultConfig = {
      class: '',
    };

    this.config = merge(defaultConfig, instance.config.typeConfig);
    this.value = instance.config.defaultValue;
  }

  getInputValue(rootTemplateNode) {
    return rootTemplateNode.querySelector(`[${ARIA_TEXT_INPUT}]`).value;
  }

  valueToHTML(value) {
    return value;
  }

  onDisplay(rootTemplateNode, value) {
    // eslint-disable-next-line
    rootTemplateNode.firstChild.value = value;
  }

  onDestroy() {
    return null;
  }

  getMarkup() {
    return `<div><input type="text" ${ARIA_TEXT_INPUT} class="${this.config.class}" /></div>`;
  }
}
