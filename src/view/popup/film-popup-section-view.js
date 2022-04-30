import { createElement } from '../../render.js';

const createFilmPopupTemplate = () => ('<section class="film-details"></section>');

export default class FilmPopupSectionView {
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
