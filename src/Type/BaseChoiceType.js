/* eslint-disable class-methods-use-this */

import { resolveConfig, parseTemplateAsync } from '../Util';

export default class {
  constructor(instance, config, aria) {
    this.config = resolveConfig(config, this);
    this.aria = aria;
    this.instance = instance;
    this.markup = null;
    this.rootNode = null;
    this.source = [];
  }

  init() {
    return new Promise((resolve) => {
      const dataSource = this.config('dataSource');
      if (Array.isArray(dataSource)) {
        this.source = dataSource;
        resolve();
      } else {
        Promise.resolve(dataSource()).then((data) => {
          this.source = data;
          resolve();
        });
      }
    });
  }

  internalShow(rootNode, value, cbNotEmpty) {
    this.rootNode = rootNode;
    return new Promise((resolve) => {
      Promise.resolve(this.getTemplate()).then((asyncMarkup) => {
        Promise.resolve(parseTemplateAsync(asyncMarkup)).then((markup) => {
          if (this.instance.config('emptyValue') !== value) {
            cbNotEmpty(markup);
          }
          this.markup = markup;
          rootNode.appendChild(markup);
          resolve();
        });
      });
    });
  }

  getReadableValue(value) {
    const separator = this.config('displaySeparator') || ', ';
    return value.map((v) => this.source.find((it) => `${it.value}` === `${v}`).text).join(separator);
  }

  disable(status) {
    this.markup.querySelectorAll(`[${this.aria}]`)
      .forEach((n) => { n.disabled = status; });
  }

  onDestroy() {
    return null;
  }

  getTemplate() {
    return null;
  }
}
