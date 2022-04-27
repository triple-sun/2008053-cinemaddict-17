import { createElement } from '../render.js';
import { NAVIGATION_TEMPLATE } from '../constants.js';

export default class Navigation {
  getTemplate() {
    return NAVIGATION_TEMPLATE;
  }

  getElement(card) {
    if (!this.element) {
      this.element = createElement(this.getTemplate(card));
    }
    return this.element;
  }
}
