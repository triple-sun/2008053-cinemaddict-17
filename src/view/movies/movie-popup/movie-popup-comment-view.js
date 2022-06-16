import he from 'he';
import { humanizeCommentDate } from '../../../utils/common.js';
import AbstractStatefulView from '../../../framework/view/abstract-stateful-view.js';

const POPUP_DELETE_COMMENT_BUTTON_CLASS_SELECTOR = '.film-details__comment-delete';
const POPUP_DELETE_COMMENT_BUTTON_DISABLED = 'disabled';
const POPUP_COMMENT_DELETE_BUTTON_TEXT = 'Delete';
const POPUP_COMMENT_DELETING_BUTTON_TEXT = 'Deleting...';

const createCommentTemplate = (data) => {
  const {id, author, comment, date, emotion, isDeleting, isDisabled} = data;

  return (`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-angry">
    </span>
    <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
    <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? POPUP_DELETE_COMMENT_BUTTON_DISABLED : ''}>${isDeleting ? POPUP_COMMENT_DELETING_BUTTON_TEXT : POPUP_COMMENT_DELETE_BUTTON_TEXT}</button>
  </p>
  </div>
  </li>`);
};


export default class MoviePopupCommentView extends AbstractStatefulView {
  _state= null;

  constructor(comment, handleCommentAction) {
    super();
    this._state = MoviePopupCommentView.parseCommentToState(comment, handleCommentAction);
  }

  get template() {
    return createCommentTemplate(this._state);
  }

  _restoreHandlers = () => this.setDeleteButtonClickHandler(this._callback.deleteClick);

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector(POPUP_DELETE_COMMENT_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(MoviePopupCommentView.parseStateToComment(this._state));
  };

  static parseCommentToState = (comment, handleCommentAction) => ({
    ...comment,
    handleCommentAction,
    isDeleting: null,
    isDisabled: null,
  });

  static parseStateToComment= (state) => {
    const comment = {...state};

    delete comment.handleCommentAction;
    delete comment.isDeleting;
    delete comment.isDisabled;

    return comment;
  };
}
