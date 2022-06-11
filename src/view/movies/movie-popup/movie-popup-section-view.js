import AbstractView from '../../../framework/view/abstract-stateful-view.js';

const createMoviePopupSectionTemplate = () => ('<section class="film-details"></section>');

export default class MoviePopupSectionView extends AbstractView {
  get template() {
    return createMoviePopupSectionTemplate();
  }
}
