import AbstractView from '../framework/view/abstract-view.js';

const NOVICE_MOVIE_COUNT = 10;
const FAN_MOVIE_COUNT = 20;

const UserTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  BUFF: 'Movie Buff'
};

const createUserTitleTemplate = (watchedMovieCount) => {
  let userTitle = UserTitle.NOVICE;

  if (watchedMovieCount > NOVICE_MOVIE_COUNT) {
    userTitle = UserTitle.FAN;
    if (watchedMovieCount > FAN_MOVIE_COUNT) {
      userTitle = UserTitle.BUFF;
    }
  }

  return  watchedMovieCount
    ? `<section class="header__profile profile">
        <p class="profile__rating">${userTitle}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    : '';
};

export default class UserTitleView extends AbstractView {
  #watchedMovieCount = null;

  constructor(watchedMovieCount) {
    super();
    this.#watchedMovieCount = watchedMovieCount;
  }

  get template() {
    return createUserTitleTemplate(this.#watchedMovieCount);
  }
}
