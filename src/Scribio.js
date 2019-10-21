import merge from 'merge';

import Instance from './Instance';
import defaultConfig from './DefaultConfig';

class Scribio {
  constructor(config = {}) {
    this.types = new Map();
    this.renderers = new Map();
    this.defaultConfig = merge(defaultConfig, config);
  }

  getType(type, config = {}) {
    if (!this.types.has(type)) throw new Error(`Unknown type ${type}`);
    const Type = this.types.get(type);
    return (instance) => new Type(instance, config);
  }

  getRenderer(renderer, config = {}) {
    if (!this.renderers.has(renderer)) throw new Error(`Unknown renderer ${renderer}`);
    return (instance) => this.renderers.get(renderer)(instance, config);
  }

  span(container, givenConfig = {}) {
    const config = merge(this.defaultConfig, givenConfig);
    return new Instance(
      container,
      this.getType(config.type, config.type.config),
      this.getRenderer(config.renderer, config.renderer.config),
      config,
    );
  }
}
