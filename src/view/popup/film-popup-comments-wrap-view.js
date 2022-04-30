import { createElement } from '../../render.js';

const createCommentsWrapTemplate = (comments) => (
  `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
  </section>`
);

export default class FilmPopupCommentsWrapView {
  constructor(comments) {
    this.comments = comments;
  }

  getTemplate() {
    return createCommentsWrapTemplate(this.comments);
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
