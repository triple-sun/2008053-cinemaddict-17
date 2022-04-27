import { createElement } from '../render.js';
import { USER_TITLE_TEMPLATE } from '../constants.js';

export default class UserTitleView {
  getTemplate() {
    return USER_TITLE_TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
