import { ErrorType } from '../../const.js';
import AbstractView from '../../framework/view/abstract-stateful-view.js';

const createMoviePopupBottomContainerTemplate = (comments) => {
  const commentsCount = comments === ErrorType.COMMENTS_ERROR
    ? '<h2 class="films-list__title">Failed to load comments</h2>'
    : `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>`;

  return (`<div class="film-details__bottom-container">${commentsCount}<section class="film-details__comments-wrap"></section></div>`);
};

export default class MoviePopupBottomContainerView extends AbstractView {
  #comments = null;

  constructor(commentsModel) {
    super();
    this.#comments = commentsModel.comments;
  }

  get template() {
    return createMoviePopupBottomContainerTemplate(this.#comments);
  }
}
