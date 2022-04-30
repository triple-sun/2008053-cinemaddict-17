import { createElement } from '../../render.js';

const createFilmPopupCommentsListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class FilmPopupCommentsListView {
  getTemplate() {
    return createFilmPopupCommentsListTemplate();
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
