import AbstractView from '../../../framework/view/abstract-view.js';

const createMoviePopupCommentsCountTemplate = (comments, hadFailed) => hadFailed
  ? '<h3 class="film-details__comments-title">Failed to load comments</h2>'
  : `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>`;


export default class MoviePopupCommentsCountView extends AbstractView {
  #comments = [];
  #hadFailed = null;

  constructor(comments, hadFailed) {
    super();
    this.#comments = comments;
    this.#hadFailed = hadFailed;
  }

  get template() {
    return createMoviePopupCommentsCountTemplate(this.#comments, this.#hadFailed);
  }
}
