import { createElement } from '../../render.js';

const createFilmPopupBottomTemplate = () => '<div class="film-details__bottom-container"></div>';

export default class FilmPopupBottomContainerView {
  getTemplate() {
    return createFilmPopupBottomTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
