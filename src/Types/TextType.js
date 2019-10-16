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

  static inputToValue(rootTemplateNode) {
    return rootTemplateNode.firstChild.value;
  }

  static valueToInput(value) {
    return value;
  }

  static valueToHTML(value) {
    return value;
  }

  static onDisplay(rootTemplateNode, value) {
    // eslint-disable-next-line
    rootTemplateNode.firstChild.value = value;
  }

  onDestroy() {
  }

  getTemplate() {
    return `<div><input type="text" class="${this.config.class}" /></div>`;
  }
}
