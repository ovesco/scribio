import Loader from './Loader';
import Instance from './Instance';

class Scribus {
  constructor() {
    this.loader = Loader;
  }

  scribe(container, config = {}) {
    const typename = config.type || 'text';
    const instance = new Instance(container, this.loader.getType(typename), config);
    return instance;
  }
}

export default new Scribus();
