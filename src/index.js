import Scribio from './Scribio';
import TextType from './Type/TextType';
import SelectType from './Type/SelectType';
import PopupRenderer from './Renderer/PopupRenderer';

Scribio.registerRenderer('popup', PopupRenderer);
Scribio.registerType('text', TextType);
Scribio.registerType('select', SelectType);

Scribio.span(document.querySelector('#scribio'), {
  type: { config: { type: 'number' } },
});
Scribio.span(document.querySelector('#select'), {
  type: { name: 'select' },
});
