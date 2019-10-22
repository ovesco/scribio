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

Scribio.span(document.querySelector('#scribio'), {
  type: {
    config: {
      type: 'number',
      attributes: 'min="0" max="10" step="2"',
    },
  },
  currentValue: 5,
});
Scribio.span(document.querySelector('#select'), {
  type: { name: 'select' },
});
Scribio.span(document.querySelector('#checkbox'), 'checkbox');
Scribio.span(document.querySelector('#radio'), 'radio');
