import flat from 'flat';
import merge from 'deepmerge';

export const resolveConfig = (config, item) => {
  const flatten = flat.flatten(config, { safe: true });
  const mapConfig = new Map();
  Object.keys(flatten).forEach((key) => {
    const val = flatten[key];
    mapConfig.set(key, (typeof val === 'function') ? () => val.bind(item) : () => val);
  });
  return (key) => {
    if (!mapConfig.has(key)) throw new Error(`Unknown config key ${key}`);
    return mapConfig.get(key)();
  };
};

export const themeResolver = (themes, ld, name) => themes.flatMap(ld)
  .filter((tu) => tu !== undefined)
  .filter((ty) => ty.name === name)
  .reduce((ta, tb) => merge(ta.config, tb.config), {});

export const parseTemplate = (template) => {
  if (template instanceof Element || template instanceof Node) return template;
  let item = template;
  if (typeof template === 'function') item = template();
  return (new DOMParser()).parseFromString(item, 'text/html').body.firstElementChild;
};

export const parseTemplateAsync = (template) => Promise.resolve(template)
  .then(((tmpl) => parseTemplate(tmpl)));

export const emptyContent = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};
