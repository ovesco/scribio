import merge from 'merge';

const resolveFunction = (item, instance) => {
  if (typeof item === 'function') return item(instance);
  return item;
};

export default class {
  constructor(container, Type, config = {}) {
    // Declare default options
    const defaultConfig = {
      disabled: false,
      type: 'text',
      typeConfig: {},
      defaultValue: null,
      valueDisplay: (value) => value,
      emptyValueDisplay: 'Empty',
      mode: 'popup',
      server: {
        url: null,
        requestParams: {},
        onSubmit: (value, onSuccess, onError) => {
          const { server } = this.config;
          fetch(resolveFunction(server.url, this), merge({ value },
            resolveFunction(server.requestParams))).then((res) => res.json())
            .then((data) => onSuccess(data))
            .catch((error) => onError(error));
        },
      },
    };

    this.config = merge(config, defaultConfig);
    this.container = container;
    this.type = new Type(this);
  }

  refreshPrintedValue() {
  }
}
