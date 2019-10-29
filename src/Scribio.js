import merge from 'deepmerge';

import Instance from './Instance';
import defaultConfig from './DefaultConfig';
import { themeResolver } from './Util';

const defaultTheme = {
  renderers: [],
  types: [],
};

class Scribio {
  constructor(config = {}) {
    this.types = new Map();
    this.renderers = new Map();
    this.defaultConfig = merge(defaultConfig, config);
    this.themes = [defaultTheme];
  }

  registerRenderer(name, Renderer, loadedConfig = {}) {
    this.renderers.set(name, { Renderer, loadedConfig });
  }

  loadTheme(theme) {
    this.themes.push(theme);
  }

  registerType(name, Type, loadedConfig = {}) {
    this.types.set(name, { Type, loadedConfig });
  }

  getType({ name, config }) {
    if (!this.types.has(name)) throw new Error(`Unknown type ${name}`);
    const { Type, loadedConfig } = this.types.get(name);
    const themeConfig = themeResolver(this.themes, (t) => t.types, name);
    return (instance) => new Type(instance, merge.all([loadedConfig, themeConfig, config]));
  }

  getRenderer({ name, config }) {
    if (!this.renderers.has(name)) throw new Error(`Unknown renderer ${name}`);
    const themeConfig = themeResolver(this.themes, (t) => t.renderers, name);
    const { Renderer, loadedConfig } = this.renderers.get(name);
    return (instance) => new Renderer(instance, merge.all([loadedConfig, themeConfig, config]));
  }

  span(container, givenConfig = {}) {
    let gconf = givenConfig;
    if (typeof givenConfig === 'string') gconf = { type: { name: givenConfig } };
    const themeConfig = this.themes.map((t) => t.config)
      .filter((tu) => tu !== undefined)
      .reduce((ta, tb) => merge(ta, tb), {});
    const config = merge(merge(this.defaultConfig, themeConfig), gconf);
    return new Instance(
      container,
      this.getType(config.type),
      this.getRenderer(config.renderer),
      config,
    );
  }
}

export default new Scribio();
