import { createElement } from '../render.js';
import { FILTERS_TEMPLATE } from '../constants.js';

export default class Filters {
  getTemplate() {
    return FILTERS_TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
