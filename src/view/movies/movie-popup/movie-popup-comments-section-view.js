
import AbstractView from '../../../framework/view/abstract-view.js';

const createMoviePopupCommentsSectionTemplate = () => ('<section class="film-details__comments-wrap"></section>');

export default class MoviePopupCommentsSectionView extends AbstractView {
  get template() {
    return createMoviePopupCommentsSectionTemplate();
  }
}
