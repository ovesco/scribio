import flat from 'flat';

export const resolveConfig = (config, item) => {
  const flatten = flat.flatten(config);
  const mapConfig = new Map();
  Object.keys(flatten).forEach((key) => {
    const val = flatten[key];
    mapConfig.set(key, (typeof val === 'function') ? val.bind(item) : () => val);
  });
  return (key) => {
    if (!mapConfig.has(key)) throw new Error(`Unknown config key ${key}`);
    return mapConfig.get(key)();
  };
};

export const parseTemplate = (template) => {
  if (template instanceof Element || template instanceof Node) return template;
  const templateNode = document.createElement('template');
  templateNode.innerHTML = template.trim();
  return templateNode.content.firstChild;
};

export const parseTemplateAsync = (template) => Promise.resolve(parseTemplate(template));

export const emptyContent = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};
