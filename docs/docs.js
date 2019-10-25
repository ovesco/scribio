// eslint-disable-next-line
import Scribio, { BootstrapTheme } from 'Scribio';
import Popper from 'popper.js';

import './scss/docs.scss';

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

const onSubmit = (value, onSuccess) => {
  onSuccess(value);
};

Scribio.loadTheme(PopperTheme);
Scribio.loadTheme(BootstrapTheme('sm'));
const headerInstance = Scribio.span(document.getElementById('scribio'), {
  currentValue: 'Scribio',
  handler: {
    onSubmit,
  },
});

setTimeout(() => {
  headerInstance.open();
}, 700);

Scribio.span(document.getElementById('types'), {
  type: {
    name: 'checkbox',
    config: {
      displaySeparator: ' ',
      dataSource: [{ value: 1, text: 'Integrated' }, { value: 2, text: 'types' }, { value: 3, text: 'Triggers an error' }],
    },
  },
  currentValue: [1, 2],
  handler: {
    onSubmit,
    validate(value) {
      return !value.includes('3');
    },
  },
});

Scribio.span(document.getElementById('extendable'), {
  type: {
    name: 'text',
    config: {
      type: 'textarea',
    },
  },
  currentValue: 'Easily extendable',
  handler: {
    onSubmit,
  },
});

Scribio.span(document.getElementById('options'), {
  type: {
    name: 'radio',
    config: {
      dataSource: [{ value: 1, text: 'Many options' }, { value: 2, text: 'Much possibilites' }, { value: 3, text: 'Such flexibility' }],
    },
  },
  buttons: {
    submitText: 'Ayyyy',
    cancelText: 'Lmfao',
  },
  currentValue: 1,
  handler: {
    onSubmit(value, onSuccess) {
      alert(`You chose [${this.session.type.getReadableValue(value)}], which is a cool choice`);
      onSuccess(value);
    },
    onCancel(forward) {
      alert('You cancelled it :\'(');
      forward();
    },
  },
});

Scribio.span(document.getElementById('async'), {
  type: {
    name: 'select',
    config: {
      dataSource: [{ value: 1, text: 'Async by nature' }, { value: 2, text: 'Awesome features' }],
    },
  },
  currentValue: 1,
  handler: {
    onOpen(cb) {
      setTimeout(() => { cb(); }, 1000);
    },
    onSubmit(value, onSuccess) {
      setTimeout(() => {
        onSuccess(value);
      }, 1500);
    },
  },
});
