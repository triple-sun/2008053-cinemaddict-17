import AbstractView from '../../../framework/view/abstract-view.js';

const POPUP_CLOSE_BUTTON_CLASS_SELECTOR = '.film-details__close-btn';

const createMoviePopupCloseButtonTemplate = () =>  ('<div class="film-details__close"><button class="film-details__close-btn" type="button">close</button></div>');

export default class MoviePopupCloseButtonView extends AbstractView {
  get template() {
    return createMoviePopupCloseButtonTemplate();
  }

  _restoreHandlers = () => this.setCloseButtonClickHandler(this.#closeButtonClickHandler);

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector(POPUP_CLOSE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };
}
