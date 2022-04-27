import { createElement } from '../render.js';
import { POPUP_TEMPLATE } from '../constants.js';

export default class MoviePopup {
  getTemplate() {
    return POPUP_TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
