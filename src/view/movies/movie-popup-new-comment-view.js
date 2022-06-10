import { UpdateType, UserAction } from '../../const.js';
import { generateComment} from '../../utils/movie.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

const POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR = '.film-details__comment-input';
const POPUP_EMOJI_LIST_ITEM_CLASS_SELECTOR = '.film-details__emoji-item';

const createMoviePopupNewCommentTemplate = (data) => {
  const {newCommentEmoji, newCommentText} = data;

  return (`
  <div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">
  ${newCommentEmoji
      ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}"></img>`
      : ''
    }
</div>

 <label class="film-details__comment-label">
   ${newCommentText
      ? `<textarea class='film-details__comment-input' name='comment'>${newCommentText}</textarea>`
      : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" disabled></textarea>'
    }
 </label>

 <div class="film-details__emoji-list">
 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
 <label class="film-details__emoji-label" for="emoji-smile">
   <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
 <label class="film-details__emoji-label" for="emoji-sleeping">
   <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
 <label class="film-details__emoji-label" for="emoji-puke">
   <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
 </label>

 <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
 <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
`);
};

export default class MoviePopupNewCommentView extends AbstractStatefulView {
  _state = null;

  constructor(commentsModel) {
    super();
    this._state = MoviePopupNewCommentView.parseDataToState(commentsModel);
    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupNewCommentTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #emojiClickHandler = (evt) => {
    const commentText = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;
    const scrollPosition = this.element.scrollTop;
    const emojiName = evt.target.value;

    if (this._state.newCommentEmoji !== emojiName) {
      this.updateElement({newCommentEmoji: emojiName, newCommentText: commentText});
      this.element.scrollTop = scrollPosition;
    }
  };

  #newCommentSubmitFormHandler = (evt) => {
    const commentText = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;
    const newCommentEmoji = this._state.newCommentEmoji;

    if ((commentText && newCommentEmoji) && (evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey))) {
      const newComment = generateComment(commentText, new Date(), this._state.newCommentEmoji);
      evt.preventDefault();
      this.#handleCommentAction(UserAction.ADD_COMMENT, UpdateType.INIT, newComment);
    }
  };

  #handleCommentAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._state.commentsModel.addComment(updateType, update);
        this.updateElement({newCommentEmoji: null, newCommentText: null});
        break;
      case UserAction.DELETE_COMMENT:
        this._state.commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll(POPUP_EMOJI_LIST_ITEM_CLASS_SELECTOR).forEach((element) => element.addEventListener('click', this.#emojiClickHandler));
    this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).addEventListener('keydown', this.#newCommentSubmitFormHandler);
  };

  static parseDataToState = (commentsModel) => ({
    commentsModel,
    newCommentEmoji: null,
    newCommentText: null,
  });

  static parseCommentToState = (comment) => this._state.comments.push(comment);
}
