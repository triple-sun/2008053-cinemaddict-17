import { createElement } from '../render.js';
import { CARD_TEMPLATE } from '../constants.js';

export default class FilmCard {
  getTemplate() {
    return CARD_TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
