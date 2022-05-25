import { DOCUMENT_NO_SCROLL_CLASS, FILM_POPUP_CONTROLS_ACTIVE_CLASS } from '../../const.js';
import { createTemplatesFromArray, humanizeCommentDateTime, humanizeReleaseDate, humanizeRuntime, setUserListButtonActiveClass } from '../../utils/film.js';
import { generateComment } from '../../mock/comment.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';


const POPUP_CLOSE_BUTTON_CLASS_SELECTOR = '.film-details__close-btn';
const POPUP_WATCHLIST_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watchlist';
const POPUP_WATCHED_BUTTON_CLASS_SELECTOR = '.film-details__control-button--watched';
const POPUP_FAVORITE_BUTTON_CLASS_SELECTOR = '.film-details__control-button--favorite';

const POPUP_NEW_COMMENT_FORM_SELECTOR = 'form';
const POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR = '.film-details__comment-input';
const POPUP_EMOJI_LIST_CLASS_SELECTOR = '.film-details__emoji-list';

const EMOJI_NODE_NAME = 'IMG';

const body = document.body;

const createGenreTemplate = (filmGenre) => `<span class="film-details__genre">${filmGenre}</span>`;

const createCommentTemplate = (filmComment) => {
  const {author, comment, date, emotion} = filmComment;

  return (`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-angry">
    </span>
    <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${humanizeCommentDateTime(date)}</span>
    <button class="film-details__comment-delete">Delete</button>
  </p>
  </div>
  </li>`);
};

const showNewCommentEmoji = (newCommentEmoji) => newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}"></img>` : '';

const showNewCommentText = (newCommentText) => newCommentText
  ? `<textarea class='film-details__comment-input' name='comment'>${newCommentText}</textarea>`
  : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';

const createFilmPopupTopSectionTemplate = (data) => {
  const {comments, filmInfo, userDetails, commentsModel, newCommentEmoji, newCommentText} = data;
  const {title, poster, ageRating, totalRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const filmGenres = createTemplatesFromArray([...genre], createGenreTemplate);
  const filmComments = createTemplatesFromArray([...commentsModel.comments], createCommentTemplate);

  return (`
   <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
             <img class="film-details__poster-img" src="${poster}" alt="">

             <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${title}</h3>
        <p class="film-details__title-original">Original: ${title}</p>
      </div>

      <div class="film-details__rating">
        <p class="film-details__total-rating">${totalRating}</p>
      </div>
    </div>

    <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${humanizeReleaseDate(release.date)}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${humanizeRuntime(runtime)}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${release.releaseCountry}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">${filmGenres}</tr>
    </table>

    <p class="film-details__film-description">${description}</p>
  </div>
  </div>

<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setUserListButtonActiveClass(watchlist, FILM_POPUP_CONTROLS_ACTIVE_CLASS)}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${setUserListButtonActiveClass(alreadyWatched, FILM_POPUP_CONTROLS_ACTIVE_CLASS)} " id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${setUserListButtonActiveClass(favorite, FILM_POPUP_CONTROLS_ACTIVE_CLASS)}" id="favorite" name="favorite">Add to favorites</button>
</section>
</div>
<div class="film-details__bottom-container">
<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
  ${filmComments}
  </ul>
  <div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">${showNewCommentEmoji(newCommentEmoji)}</div>

 <label class="film-details__comment-label">
   ${showNewCommentText(newCommentText)}
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
      </section>
    </div>
  </form>
</section>
`);
};

export default class FilmPopupView extends AbstractStatefulView {
  _state = null;

  constructor(film, commentsModel) {
    super();
    this._state = FilmPopupView.parseDataToState(film, commentsModel);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTopSectionTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this.#closeButtonClickHandler);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

  };

  setCloseButtonClickHandler = () => {
    this.element.querySelector(POPUP_CLOSE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector(POPUP_WATCHLIST_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector(POPUP_WATCHED_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector(POPUP_FAVORITE_BUTTON_CLASS_SELECTOR).addEventListener('click', this.#favoriteClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.hidePopup();
  };

  #watchlistClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.favoriteClick();
  };

  #emojiClickHandler = (evt) => {
    const commentText = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;

    if (evt.target.nodeName === EMOJI_NODE_NAME) {
      const emojiName = evt.target.src.slice(evt.target.src.lastIndexOf('/')+1, evt.target.src.lastIndexOf('.'));

      if (this._state.newCommentEmoji !== emojiName) {
        const scrollPosition = this.element.scrollTop;

        this.updateElement({newCommentEmoji: emojiName, newCommentText: commentText});

        this.element.scrollTop = scrollPosition;
      }
    }
  };


  #newCommentSubmitFormHandler = (evt) => {
    const commentText = this.element.querySelector(POPUP_NEW_COMMENT_INPUT_CLASS_SELECTOR).value;
    const newCommentEmoji = this._state.newCommentEmoji;

    if (commentText && newCommentEmoji && (evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey))) {
      const scrollPosition = this.element.scrollTop;

      this._state.commentsModel.comments.push(generateComment(commentText, new Date(), this._state.newCommentEmoji));
      this.updateElement({newCommentEmoji: null, newCommentText: null});
      this.element.scrollTop = scrollPosition;
    }
  };

  #popupEscKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.hidePopup();
    }
  };

  hidePopup = () => {
    body.classList.remove(DOCUMENT_NO_SCROLL_CLASS);
    body.removeEventListener('keydown', this.#popupEscKeydownHandler);
    this.element.remove();
  };

  #setInnerHandlers = () => {
    this.element.querySelector(POPUP_EMOJI_LIST_CLASS_SELECTOR).addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector(POPUP_NEW_COMMENT_FORM_SELECTOR).addEventListener('keypress', this.#newCommentSubmitFormHandler);
  };

  static parseDataToState = (film, commentsModel) => ({
    ...film,
    commentsModel,
    newCommentEmoji: null,
    newCommentText: null
  });

  static parseCommentToState = (comment) => this._state.comments.push(comment);
}
