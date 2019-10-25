import Popper from 'popper.js';
import Scribio from './build';

const PopperTheme = {
  renderers: [
    {
      name: 'popup',
      config: {
        popper: Popper,
      },
    },
  ],
};

Scribio.loadTheme(PopperTheme);

export default Scribio;
