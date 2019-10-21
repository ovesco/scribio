import { resolveConfig, parseTemplateAsync } from './Util';
import { ARIA_ACTION_CONTAINER } from './DefaultConfig';

export default class {
  constructor(container, type, renderer, config = {}) {
    this.config = resolveConfig(config, this);
    this.container = container;
    this.renderer = renderer;
    this.type = type;
    this.renderSession = null;
  }

  open() {
    const renderSession = this.renderer(this);
    renderSession.loading(true);
    parseTemplateAsync(this.config('template.edit')).then((markup) => {
      renderSession.show(markup);
      renderSession.loading(false);
    });
    this.renderSession = renderSession;
  }

  close() {

  }
}
