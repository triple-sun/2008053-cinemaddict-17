import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { DOCUMENT_NO_SCROLL_CLASS, pageFooterSection, UpdateType, UserAction } from '../const.js';
import MoviePopupCommentPresenter from './movie-popup-comment-presenter.js';
import MoviePopupSectionView from '../view/movies/movie-popup-section-view.js';
import MoviePopupTopContainerView from '../view/movies/movie-popup-top-container-view.js';
import MoviePopupBottomContainerView from '../view/movies/movie-popup-bottom-container-view.js';
import MoviePopupNewCommentView from '../view/movies/movie-popup-new-comment-view.js';
import MoviePopupFormView from '../view/movies/movie-popup-form-view.js';

const pageBody = document.querySelector('body');

export default class MoviePopupPresenter {
  #movie = null;
  #popupSectionComponent = null;
  #popupFormComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #popupNewCommentForm = null;

  #commentsModel = null;
  #handlePopupClose = null;
  #handleMovieUserDataUpdate = null;

  #scrollPosition = null;

  constructor (commentsModel, handlePopupClose, handleMovieUserDataUpdate) {
    this.#commentsModel = commentsModel;
    this.#handlePopupClose = handlePopupClose;
    this.#handleMovieUserDataUpdate = handleMovieUserDataUpdate;
  }

  init = (movie) => {
    const prevPopupComponent = this.#popupSectionComponent;

    this.#movie = movie;
    this.#popupSectionComponent = new MoviePopupSectionView();
    this.#popupFormComponent = new MoviePopupFormView();
    this.#popupTopContainerComponent = new MoviePopupTopContainerView(movie, this.#commentsModel);
    this.#popupBottomContainerComponent = new MoviePopupBottomContainerView(this.#commentsModel);
    this.#popupNewCommentForm = new MoviePopupNewCommentView(this.#commentsModel, this.#handleCommentAction);

    this.#renderPopupForm();
    this.#renderPopupTopContainer();
    this.#renderPopupBottomContainer();
    this.#renderComments();
    this.#renderNewCommentForm();

    this.#popupTopContainerComponent.setCloseButtonClickHandler(this.#handlePopupClose);
    this.#popupTopContainerComponent.setWatchlistClickHandler(this.#handlePopupWatchlistClick);
    this.#popupTopContainerComponent.setAlreadyWatchedClickHandler(this.#handlePopupWatchedClick);
    this.#popupTopContainerComponent.setFavoriteClickHandler(this.#handlePopupFavoriteClick);

    document.addEventListener('keydown', this.#popupEscKeydownHandler);
    pageBody.classList.add(DOCUMENT_NO_SCROLL_CLASS);

    if (!prevPopupComponent) {
      render(this.#popupSectionComponent, pageFooterSection, RenderPosition.AFTEREND);
      return;
    }

    if (pageBody.contains(prevPopupComponent.element)){
      this.#scrollPosition = prevPopupComponent.element.scrollTop;
      replace(this.#popupSectionComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);

    if (this.#scrollPosition) {
      this.#popupSectionComponent.element.scrollTop = this.#scrollPosition;
    }
  };

  #renderPopupForm = () => render(this.#popupFormComponent, this.#popupSectionComponent.element);

  #renderComment = (comment) => {
    const commentPresenter = new MoviePopupCommentPresenter(this.#popupBottomContainerComponent, this.#handleCommentAction);
    commentPresenter.init(comment);
  };

  #renderPopupTopContainer = () => render(this.#popupTopContainerComponent, this.#popupFormComponent.element);

  #renderPopupBottomContainer = () => render(this.#popupBottomContainerComponent, this.#popupFormComponent.element);

  #renderComments = () => this.#commentsModel.comments.forEach(this.#renderComment);

  #renderNewCommentForm = () => render(this.#popupNewCommentForm, this.#popupBottomContainerComponent.element);

  destroy = () => remove(this.#popupSectionComponent);

  #popupEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handlePopupClose();
      document.removeEventListener('keydown', this.#popupEscKeydownHandler);
    }
  };

  #handlePopupWatchlistClick = () => {
    this.#scrollPosition = this.#popupSectionComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      }
    );
  };

  #handlePopupWatchedClick = () => {
    this.#scrollPosition = this.#popupSectionComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !this.#movie.userDetails.alreadyWatched
        }
      }
    );
  };

  #handlePopupFavoriteClick = () => {
    this.#scrollPosition = this.#popupSectionComponent.element.scrollTop;
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite}
      }
    );
  };

  #handleCommentAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#popupFormComponent.element.disabled = 'disabled';
        this.#commentsModel.addComment(updateType, update);
        this.updateElement({newCommentEmoji: null, newCommentText: null});
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };
}

