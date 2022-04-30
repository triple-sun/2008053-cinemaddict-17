import FilmPopupSectionView from '../view/popup/film-popup-section-view.js';
import FilmPopupFormView from '../view/popup/film-popup-form-view.js';
import FilmPopupTopContainerView from '../view/popup/film-popup-top-container-view.js';
import FilmPopupCommentView from '../view/popup/film-popup-comment-view.js';
import FilmPopupBottomContainerView from '../view/popup/film-popup-bottom-container-view.js';
import FilmPopupCommentsWrapView from '../view/popup/film-popup-comments-wrap-view.js';
import FilmPopupCommentsListView from '../view/popup/film-popup-comments-list-view.js';
import FilmPopupNewCommentView from '../view/popup/film-popup-new-comment-view.js';
import { render } from '../render.js';

export default class FilmPopupPresenter {
  popupSectionComponent = new FilmPopupSectionView();
  popupFormComponent = new FilmPopupFormView();
  newCommentForm = new FilmPopupNewCommentView();


  init = (filmPopupContainer, film, commentsModel) => {
    this.filmPopupContainer = filmPopupContainer;
    this.commentsModel = commentsModel;
    this.comments = [...this.commentsModel.getComments()];

    this.topContainer = new FilmPopupTopContainerView(film);
    this.bottomContainer = new FilmPopupBottomContainerView();
    this.commentsWrap = new FilmPopupCommentsWrapView(film.comments);
    this.commentsList = new FilmPopupCommentsListView();

    render(this.popupSectionComponent, this.filmPopupContainer);
    render(this.popupFormComponent, this.popupSectionComponent.getElement());
    render(this.topContainer, this.popupFormComponent.getElement());
    render(this.bottomContainer, this.popupFormComponent.getElement());
    render(this.commentsWrap, this.bottomContainer.getElement());

    for (let i = 0; i < this.comments.length; i++) {
      render(new FilmPopupCommentView(this.comments[i]), this.commentsWrap.getElement());
    }

    render(this.newCommentForm, this.commentsWrap.getElement());
  };
}
