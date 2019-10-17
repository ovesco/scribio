import Scribus from './Scribus';
import PopupRenderer from './Popup';

const div = document.getElementById('scribus');
Scribus.scribe(div, {
  type: 'select',
  renderer: new PopupRenderer(),
});
