const dataSource = [];
for (let i = 0; i < 5; i += 1) dataSource.push({ value: i, text: `option-${i}` });

Scribio.span(document.querySelector('#scribio'), {
  type: {
    config: {
      type: 'text',
      attributes: 'min="0" max="10" step="2"',
    },
  },
  currentValue: '4',
  handler: {
    validate: () => true,
  },
});
Scribio.span(document.querySelector('#select'), {
  type: { name: 'select', config: { dataSource: () => new Promise((resolve) => {
        setTimeout(() => {
          console.log('yo');
          const dataSource = [];
          for (let i = 0; i < 5; i += 1) dataSource.push({ value: i, text: `option-${i}` });
          resolve(dataSource);
        }, 1000);
      }), } },
});
Scribio.span(document.querySelector('#checkbox'), {
  type: { name: 'checkbox', config: { dataSource } },
});
const instance = Scribio.span(document.querySelector('#radio'), {
  type: { name: 'radio', config: { dataSource } },
  renderer: { config: { closeOnClickOutside: false, } },
  trigger: 'none',
});

document.body.querySelector('#btn').addEventListener('click', () => {
  instance.open();
});
