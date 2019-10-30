import flat from 'flat';
import merge from 'deepmerge';
import DOMPurify from 'dompurify';

export const resolveConfig = (config, item) => {
  const flatten = flat.flatten(config, { safe: true });
  const mapConfig = new Map();
  Object.keys(flatten).forEach((key) => {
    const val = flatten[key];
    mapConfig.set(key, (typeof val === 'function') ? () => val.bind(item) : () => val);
  });

  const resolveFn = (key) => {
    if (!mapConfig.has(key)) throw new Error(`Unknown config key ${key}`);
    const value = mapConfig.get(key)();
    return (typeof value === 'function') ? value() : value;
  };

  resolveFn.fn = (key) => {
    if (!mapConfig.has(key)) throw new Error(`Unknown config key ${key}`);
    return mapConfig.get(key)();
  };

  return resolveFn;
};

export const themeResolver = (themes, ld, name) => themes.flatMap(ld)
  .filter((tu) => tu !== undefined)
  .filter((ty) => ty.name === name)
  .map((xx) => xx.config)
  .reduce((ta, tb) => merge(ta, tb), {});

export const parseTemplate = (template) => {
  if (template instanceof Element || template instanceof Node) return template;
  let item = template;
  if (typeof template === 'function') item = template();
  return (new DOMParser()).parseFromString(DOMPurify.sanitize(item), 'text/html').body.firstElementChild;
};

export const parseTemplateAsync = (template) => Promise.resolve(template)
  .then(((tmpl) => parseTemplate(tmpl)));

export const emptyContent = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};
