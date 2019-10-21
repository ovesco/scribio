import merge from 'merge';

const ARIA_SELECT_INPUT = 'aria-select-input';
const items = [];
for (let i = 0; i < 10; i++) items.push({ value: i, text: `item-${i}` });

export default class {
  constructor(instance, config = {}) {
    const defaultConfig = {
      dataSource: items,
      class: '',
      optionClass: '',
    };

    this.config = merge(defaultConfig, config);
  }

  generateMarkup(data) {
    const options = data.map(({ value, text }) => `<option class="${this.config.optionClass}" value="${value}">${text}</option>`).join('');
    return `<select class="${this.config.class}">${options}</select>`;
  }

  getMarkup() {
    return new Promise((resolve) => {
      const { dataSource } = this.config;
      if (Array.isArray(dataSource)) resolve(this.generateMarkup(dataSource));
      else dataSource.then((data) => resolve(this.generateMarkup(data)));
    });
  }
}
