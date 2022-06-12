import AbstractView from '../../../framework/view/abstract-view.js';

const createMoviePopupCommentsLoadingTemplate = () => ('<h3 class="film-details__comments-title">Loading comments...</h3>');

export default class MoviePopupCommentsLoadingView extends AbstractView {
  get template() {
    return createMoviePopupCommentsLoadingTemplate();
  }
}
