import { humanizeCommentDate } from '../../utils/common';
import he from 'he';
import { UpdateType, UserAction } from '../../const';
import AbstractView from '../../framework/view/abstract-view';

const POPUP_DELETE_COMMENT_CLASS_SELECTOR = '.film-details__comment-delete';
const COMMENT_DELETING_BUTTON_TEXT = 'Deleting...';


const createCommentTemplate = (movieComment) => {
  const {id, author, comment, date, emotion} = movieComment;

  return (`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-angry">
    </span>
    <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
    <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
  </p>
  </div>
  </li>`);
};


export default class MoviePopupCommentView extends AbstractView {
  #comment = null;
  #handleCommentAction = null;

  constructor(comment, handleCommentAction) {
    super();
    this.#comment = comment;
    this.#handleCommentAction = handleCommentAction;
    this.#setInnerHandlers();
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  _restoreHandlers = () => this.#setInnerHandlers();

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.textContent = COMMENT_DELETING_BUTTON_TEXT;
    this.#handleCommentAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, evt.target.dataset.commentId);
  };

  #setInnerHandlers = () => this.element.querySelector(POPUP_DELETE_COMMENT_CLASS_SELECTOR).addEventListener('click', this.#deleteCommentClickHandler);
}
