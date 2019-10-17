/* eslint-disable class-methods-use-this */

import merge from 'merge';

export default class {
  constructor(instance) {
    const defaultConfig = {
      type: 'text',
      class: '',
    };

    this.config = merge(defaultConfig, instance.config.typeConfig);
    this.value = instance.config.defaultValue;
  }

  getInputValue(rootTemplateNode) {
    console.log(rootTemplateNode);
    return rootTemplateNode.firstChild.value;
  }

  valueToInput(value) {
    return value;
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
    return `<div><input type="text" class="${this.config.class}" /></div>`;
  }
}
