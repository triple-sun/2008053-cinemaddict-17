import { UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import MoviePopupCommentView from '../view/movies/movie-popup/movie-popup-comment-view.js';

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

    this.#moviePopupCommentComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);
    this.#renderComment();
  };

  destroy = () => remove(this.#moviePopupCommentComponent);

  setDeleting = () => this.#moviePopupCommentComponent.updateElement({isDeleting: true, isDisabled: true});

  setAborting = () => {
    const resetCommentDeleteButton = this.#moviePopupCommentComponent.updateElement({isDeleting: false, isDisabled: false});

    this.#moviePopupCommentComponent.shake(resetCommentDeleteButton);
  };

  #renderComment = () =>  render(this.#moviePopupCommentComponent, this.#commentsContainerComponent.element);

  #handleDeleteButtonClick = (comment) => this.#handleCommentAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, comment);
}
