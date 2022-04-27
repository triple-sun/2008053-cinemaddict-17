import { createElement } from '../render.js';
import { SHOW_MORE_BUTTON_TEMPLATE } from '../constants.js';

export default class ShowMoreButtonView {
  getTemplate() {
    return SHOW_MORE_BUTTON_TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
