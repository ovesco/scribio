import TextType from './Types/TextType';

class Loader {
  constructor() {
    this.types = new Map();
  }

  registerType(name, type) {
    this.types.set(name, type);
  }

  getType(name) {
    if (!this.types.has(name)) throw new Error(`Unknown Scribus type ${name}`);
    return this.types.get(name);
  }
}

const loader = new Loader();
loader.registerType('text', TextType);

export default loader;
