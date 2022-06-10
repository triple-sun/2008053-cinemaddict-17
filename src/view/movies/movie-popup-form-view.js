import AbstractView from '../../framework/view/abstract-stateful-view.js';

const createMoviePopupFormTemplate = () => ('<form class="film-details__inner" action="" method="get"></form><');

export default class MoviePopupFormView extends AbstractView {
  get template() {
    return createMoviePopupFormTemplate();
  }
}
