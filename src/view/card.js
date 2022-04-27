import { createElement } from '../render.js';
import { CARD_TEMPLATE } from '../constants.js';

export default class FilmCard {
  getTemplate() {
    return CARD_TEMPLATE;
  }

  getElement(card) {
    if (!this.element) {
      this.element = createElement(this.getTemplate(card));
    }
    return this.element;
  }
}
