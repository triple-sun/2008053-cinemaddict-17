import { createElement } from '../../render.js';

const createFilmPopupTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FilmPopupFormView {
  getTemplate() {
    return createFilmPopupTemplate(this.film);
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
