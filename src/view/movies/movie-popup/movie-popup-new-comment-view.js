import { UpdateType, UserAction } from '../../../const.js';
import AbstractStatefulView from '../../../framework/view/abstract-stateful-view.js';

const POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR = '.film-details__comment-input';
const POPUP_EMOJI_LIST_ITEM_CLASS_SELECTOR = '.film-details__emoji-item';

const createMoviePopupNewCommentTemplate = (data) => {
  const {emotion, comment, isDisabled} = data;

  return (`
  <div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">
  ${emotion
      ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}"></img>`
      : ''
    }
</div>

 <label class="film-details__comment-label">
   ${comment
      ? `<textarea class='film-details__comment-input' name='comment' ${isDisabled ? 'disabled' : ''}>${comment}</textarea>`
      : `<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}></textarea>`
    }
 </label>

 <div class="film-details__emoji-list">
 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? 'disabled' : ''}>
 <label class="film-details__emoji-label" for="emoji-smile">
   <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isDisabled ? 'disabled' : ''}>
 <label class="film-details__emoji-label" for="emoji-sleeping">
   <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isDisabled ? 'disabled' : ''}>
 <label class="film-details__emoji-label" for="emoji-puke">
   <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isDisabled ? 'disabled' : ''}>
 <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
`);
};

export default class MoviePopupNewCommentView extends AbstractStatefulView {
  _state = null;

  constructor(commentsModel, handleCommentAction) {
    super();
    this._state = MoviePopupNewCommentView.parseDataToState(commentsModel, handleCommentAction);
    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupNewCommentTemplate(this._state);
  }

  get newCommentInputValues() {
    return MoviePopupNewCommentView.parseStateToNewComment(this._state);
  }

  set newCommentInputValues(values) {
    this.updateElement(values);
  }

  _restoreHandlers = () => this.#setInnerHandlers();

  #emojiClickHandler = (evt) => {
    const commentText = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;
    const scrollPosition = this.element.scrollTop;
    const emojiName = evt.target.value;

    if (this._state.emotion !== emojiName) {
      this.updateElement({emotion: emojiName, comment: commentText});
      this.element.scrollTop = scrollPosition;
    }
  };

  #newCommentSubmitFormHandler = (evt) => {
    this._state.comment = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;

    if ((this._state.comment && this._state.emotion) && (evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey))) {
      const newComment = this.newCommentInputValues;
      evt.preventDefault();
      this._state.handleCommentAction(UserAction.ADD_COMMENT, UpdateType.MINOR, newComment);
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll(POPUP_EMOJI_LIST_ITEM_CLASS_SELECTOR).forEach((element) => element.addEventListener('click', this.#emojiClickHandler));
    this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).addEventListener('keydown', this.#newCommentSubmitFormHandler);
  };

  static parseDataToState = (commentsModel, handleCommentAction) => ({
    commentsModel,
    handleCommentAction,
    emotion: null,
    comment: null,
    isDisabled: null,
  });

  static parseStateToNewComment= (state) => {
    const newComment = {...state};

    delete newComment.commentsModel;
    delete newComment.handleCommentAction;
    delete newComment.isDisabled;

    return newComment;
  };
}
