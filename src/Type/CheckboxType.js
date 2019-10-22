import merge from 'deepmerge';

import { resolveConfig } from '../Util';

const CHECKBOX_NAME = 'scribio-checkbox-type';

const options = [];
for (let i = 0; i < 4; i++) options.push({ value: i, text: `option-${i}` });

const defaultConfig = {
  dataSource: options,
  containerClass: '',
};

export default class {
  constructor(instance, givenConfig = {}) {
    this.config = resolveConfig(merge(defaultConfig, givenConfig));
    this.instance = instance;
    this.source = [];
  }

  onDisplay(rootNode, value) {
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    return new Promise((resolve) => {
      Promise.resolve(this.config('dataSource')).then((data) => {
        this.source = data;
        let html = `<div class="${this.config('containerClass')}">`;
        html += data.map(({ text, value }) => `<div><input type="checkbox" name="${CHECKBOX_NAME}" value="${value}">${text}</div>`);
        html += '</div>';
        resolve(html);
      });
    });
  }
}
