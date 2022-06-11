import { ErrorType } from '../../../const.js';
import AbstractView from '../../../framework/view/abstract-view.js';

const createMoviePopupCommentsCountTemplate = (comments) => comments === ErrorType.COMMENTS_ERROR
  ? '<h3 class="film-details__comments-title">Failed to load comments</h2>'
  : `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>`;


export default class MoviePopupCommentsCountView extends AbstractView {
  #comments = [];

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createMoviePopupCommentsCountTemplate(this.#comments);
  }
}
