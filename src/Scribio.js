import merge from 'deepmerge';

import Instance from './Instance';
import defaultConfig from './DefaultConfig';

class Scribio {
  constructor(config = {}) {
    this.types = new Map();
    this.renderers = new Map();
    this.defaultConfig = merge(defaultConfig, config);
  }

  registerRenderer(name, renderer) {
    this.renderers.set(name, renderer);
  }

  registerType(name, type) {
    this.types.set(name, type);
  }

  getType({ name, config }) {
    if (!this.types.has(name)) throw new Error(`Unknown type ${name}`);
    const Type = this.types.get(name);
    return (instance) => new Type(instance, config);
  }

  getRenderer({ name, config }) {
    if (!this.renderers.has(name)) throw new Error(`Unknown renderer ${name}`);
    return (instance) => this.renderers.get(name)(instance, config);
  }

  span(container, givenConfig = {}) {
    const config = merge(this.defaultConfig, givenConfig);
    return new Instance(
      container,
      this.getType(config.type),
      this.getRenderer(config.renderer),
      config,
    );
  }
}

export default new Scribio();
