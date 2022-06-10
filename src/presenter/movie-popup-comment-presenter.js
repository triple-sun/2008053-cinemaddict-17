import { render } from '../framework/render.js';
import MoviePopupCommentView from '../view/movies/movie-popup-comment-view.js';

export default class MoviePopupCommentPresenter {
  #comment = null;
  #moviePopupCommentComponent = null;

  #commentsContainerComponent = null;
  #handleCommentAction = null;

  constructor(commentsContainerComponent, handleCommentAction) {
    this.#commentsContainerComponent = commentsContainerComponent;
    this.#handleCommentAction = handleCommentAction;
  }

  init = (comment) => {
    this.#comment = comment;
    this.#moviePopupCommentComponent = new MoviePopupCommentView(this.#comment, this.#handleCommentAction);

    this.#renderComment();
  };

  #renderComment = () =>  render(this.#moviePopupCommentComponent, this.#commentsContainerComponent.element);
}
