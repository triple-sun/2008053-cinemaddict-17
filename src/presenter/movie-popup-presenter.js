import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { DOCUMENT_NO_SCROLL_CLASS, pageBody, pageFooterSection, UpdateType, UserAction } from '../const.js';
import MoviePopupCommentPresenter from './movie-popup-comment-presenter.js';
import MoviePopupSectionView from '../view/movies/movie-popup/movie-popup-section-view.js';
import MoviePopupTopContainerView from '../view/movies/movie-popup/movie-popup-top-container-view.js';
import MoviePopupBottomContainerView from '../view/movies/movie-popup/movie-popup-bottom-container-view.js';
import MoviePopupNewCommentView from '../view/movies/movie-popup/movie-popup-new-comment-view.js';
import MoviePopupFormView from '../view/movies/movie-popup/movie-popup-form-view.js';
import MoviePopupCloseButtonView from '../view/movies/movie-popup/movie-popup-close-button-view.js';
import MoviePopupInfoView from '../view/movies/movie-popup/movie-popup-info-view.js';
import MoviePopupControlsView from '../view/movies/movie-popup/movie-popup-controls-view';
import MoviePopupCommentsSectionView from '../view/movies/movie-popup/movie-popup-comments-section-view.js';
import MoviePopupCommentsCountView from '../view/movies/movie-popup/movie-popup-comments-count.js';
import MoviePopupCommentsLoadingView from '../view/movies/movie-popup/movie-popup-comments-loading-view.js';

export default class MoviePopupPresenter {
  #movie = null;

  #popupComponent = null;

  #popupFormComponent = null;
  #popupTopContainerComponent = null;
  #popupCloseButtonComponent = null;
  #popupMovieInfoComponent = null;
  #popupControlsComponent = null;

  #popupBottomContainerComponent = null;
  #popupCommentsLoadingComponent = null;
  #popupCommentsCountComponent = null;
  #popupCommentsSectionComponent = null;
  #popupNewCommentInputComponent = null;

  #commentsModel = null;
  #handlePopupClose = null;
  #handleMovieUserDataUpdate = null;

  #scrollPosition = null;

  #commentPresenters = new Map();

  #isLoading = true;

  constructor (commentsModel, handlePopupClose, handleMovieUserDataUpdate) {
    this.#commentsModel = commentsModel;
    this.#handlePopupClose = handlePopupClose;
    this.#handleMovieUserDataUpdate = handleMovieUserDataUpdate;
  }

  init = (movie) => {
    const prevPopupComponent = this.#popupComponent;

    this.#movie = movie;
    this.#popupComponent = new MoviePopupSectionView();
    this.#popupFormComponent = new MoviePopupFormView();
    this.#popupCloseButtonComponent = new MoviePopupCloseButtonView();
    this.#popupTopContainerComponent = new MoviePopupTopContainerView();
    this.#popupBottomContainerComponent = new MoviePopupBottomContainerView();
    this.#popupCommentsLoadingComponent = new MoviePopupCommentsLoadingView();
    this.#popupCommentsSectionComponent = new MoviePopupCommentsSectionView();
    this.#popupBottomContainerComponent = new MoviePopupBottomContainerView();

    this.#popupMovieInfoComponent = new MoviePopupInfoView(this.#movie);
    this.#popupControlsComponent = new MoviePopupControlsView(this.#movie);

    this.#popupNewCommentInputComponent = new MoviePopupNewCommentView(this.#commentsModel, this.#handleCommentAction);
    this.#popupCommentsCountComponent = new MoviePopupCommentsCountView(this.#commentsModel.comments, this.#commentsModel.hadFailed);

    this.#renderPopupForm();

    this.#renderPopupTopContainer();
    this.#renderPopupCloseButton();
    this.#renderPopupInfo();
    this.#renderPopupControls();

    this.#renderPopupBottomContainer();
    this.#renderPopupCommentsLoading();
    this.#renderPopupCommentsSection();
    this.#renderPopupNewCommentForm();

    this.#renderPopupComments(this.#commentsModel.comments);

    this.#popupCloseButtonComponent.setCloseButtonClickHandler(this.#handlePopupClose);

    this.#popupControlsComponent.setWatchlistClickHandler(this.#handlePopupWatchlistClick);
    this.#popupControlsComponent.setAlreadyWatchedClickHandler(this.#handlePopupWatchedClick);
    this.#popupControlsComponent.setFavoriteClickHandler(this.#handlePopupFavoriteClick);

    document.addEventListener('keydown', this.#popupEscKeydownHandler);
    pageBody.classList.add(DOCUMENT_NO_SCROLL_CLASS);

    if (!prevPopupComponent) {
      render(this.#popupComponent, pageFooterSection, RenderPosition.AFTEREND);
      return;
    }

    if (pageBody.contains(prevPopupComponent.element)){
      this.#scrollPosition = prevPopupComponent.element.scrollTop;
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);

    if (this.#scrollPosition) {
      this.#popupComponent.element.scrollTop = this.#scrollPosition;
    }
  };

  destroy = () => remove(this.#popupComponent);

  setPopupCommentsLoaded = () => {
    remove(this.#popupCommentsLoadingComponent);
    this.#renderPopupCommentsCount();
  };

  setPopupMovieUpdateAborting = () => this.#popupTopContainerComponent.shake();

  #scrollCommentsIntoView = () => this.#popupCommentsSectionComponent.element.scrollIntoView();

  #setNewCommentFormAdding = () => this.#popupNewCommentInputComponent.updateElement({isDisabled: true});

  #resetNewCommentForm = () => this.#popupNewCommentInputComponent.updateElement({emotion: null, comment: null});

  #setNewCommentFormAborting = () => {
    const resetNewCommentFormState = () => this.#popupNewCommentInputComponent.updateElement({isDisabled: false});

    this.#popupFormComponent.shake(resetNewCommentFormState);
  };

  #renderPopupForm = () => render(this.#popupFormComponent, this.#popupComponent.element);

  #renderComment = (comment) => {
    const commentPresenter = new MoviePopupCommentPresenter(this.#popupCommentsSectionComponent, this.#handleCommentAction, this.#handleMovieCommentDelete);
    commentPresenter.init(comment);
    this.#commentPresenters.set(comment.id, commentPresenter);
  };

  #renderPopupTopContainer = () => render(this.#popupTopContainerComponent, this.#popupFormComponent.element);

  #renderPopupCloseButton = () => render(this.#popupCloseButtonComponent, this.#popupTopContainerComponent.element);

  #renderPopupInfo = () => render(this.#popupMovieInfoComponent, this.#popupTopContainerComponent.element);

  #renderPopupControls = () => render(this.#popupControlsComponent, this.#popupTopContainerComponent.element);

  #renderPopupBottomContainer = () => render(this.#popupBottomContainerComponent, this.#popupFormComponent.element);

  #renderPopupCommentsLoading = () => render(this.#popupCommentsLoadingComponent, this.#popupBottomContainerComponent.element);

  #renderPopupCommentsCount = () => render(this.#popupCommentsCountComponent, this.#popupBottomContainerComponent.element, RenderPosition.AFTERBEGIN);

  #renderPopupCommentsSection = () => render(this.#popupCommentsSectionComponent, this.#popupBottomContainerComponent.element);

  #renderPopupComments = (comments) => comments.forEach(this.#renderComment);

  #renderPopupNewCommentForm = () => render(this.#popupNewCommentInputComponent, this.#popupBottomContainerComponent.element, RenderPosition.BEFOREEND);

  #popupEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handlePopupClose();
      document.removeEventListener('keydown', this.#popupEscKeydownHandler);
    }
  };

  #handlePopupWatchlistClick = () => {
    this.#scrollPosition = this.#popupComponent.element.scrollTop;
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
    this.#scrollPosition = this.#popupComponent.element.scrollTop;
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

  #handleMovieCommentDelete = () => {
    this.#scrollPosition = this.#popupComponent.element.scrollTop;

    const updatedComments = this.#commentsModel.comments.map((comment) => comment.id);
    this.#handleMovieUserDataUpdate(
      UpdateType.MINOR,
      {
        ...this.#movie,
        comments: updatedComments
      }
    );
  };

  #handleCommentAction = async (actionType, updateType, update) => {
    const newCommentValues = this.#popupNewCommentInputComponent.newCommentInputValues;

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#setNewCommentFormAdding();
        try {
          await this.#commentsModel.addComment(updateType, update);
          this.#resetNewCommentForm();
          this.#scrollCommentsIntoView();
        } catch (err) {
          this.#setNewCommentFormAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentPresenters.get(update.id).setDeleting(update);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          this.#handleMovieCommentDelete(update);
          this.#popupNewCommentInputComponent.newCommentInputValues = newCommentValues;
        } catch (err) {
          this.#commentPresenters.get(update.id).setAborting();
        }
        break;
    }
  };
}

