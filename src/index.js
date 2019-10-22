import Scribio from './Scribio';
import TextType from './Type/TextType';
import SelectType from './Type/SelectType';
import CheckboxType from './Type/CheckboxType';
import RadioType from './Type/RadioType';
import PopupRenderer from './Renderer/PopupRenderer';

import BootstrapTheme from './Theme/BootstrapTheme';

Scribio.loadTheme(BootstrapTheme('sm'));
Scribio.registerRenderer('popup', PopupRenderer);
Scribio.registerType('text', TextType);
Scribio.registerType('select', SelectType);
Scribio.registerType('checkbox', CheckboxType);
Scribio.registerType('radio', RadioType);

const dataSource = [];
for (let i = 0; i < 5; i += 1) dataSource.push({ value: i, text: `option-${i}` });

Scribio.span(document.querySelector('#scribio'), {
  type: {
    config: {
      type: 'text',
      attributes: 'min="0" max="10" step="2"',
    },
  },
  currentValue: 4,
  handler: {
    validate: () => false,
  },
});
Scribio.span(document.querySelector('#select'), {
  type: { name: 'select', config: { dataSource } },
});
Scribio.span(document.querySelector('#checkbox'), {
  type: { name: 'checkbox', config: { dataSource } },
});
Scribio.span(document.querySelector('#radio'), {
  type: { name: 'radio', config: { dataSource } },
});
