import Scribio from './Scribio';
import TextType from './Type/TextType';
import SelectType from './Type/SelectType';
import CheckboxType from './Type/CheckboxType';
import RadioType from './Type/RadioType';
import PopupRenderer from './Renderer/PopupRenderer';

import IBootstrapTheme from './Theme/BootstrapTheme';

Scribio.registerRenderer('popup', PopupRenderer);
Scribio.registerType('text', TextType);
Scribio.registerType('select', SelectType);
Scribio.registerType('checkbox', CheckboxType);
Scribio.registerType('radio', RadioType);

export const BootstrapTheme = (size) => IBootstrapTheme(size);
export default Scribio;
