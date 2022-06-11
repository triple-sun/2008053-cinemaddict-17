import AbstractView from '../../../framework/view/abstract-view.js';
import { createTemplatesFromArray, humanizeReleaseDate, humanizeRuntime } from '../../../utils/movie.js';

const SINGLE_GENRE = 1;

const createGenreTemplate = (movieGenre) => `<span class="film-details__genre">${movieGenre}</span>`;

const createMoviePopupInfoTemplate = (movie) => {
  const {filmInfo} = movie;
  const {title, poster, ageRating, totalRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const filmGenres = createTemplatesFromArray([...genre], createGenreTemplate);

  const genreNoun = genre.length > SINGLE_GENRE
    ? 'Genres'
    : 'Genre';


  return (`
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
        <td class="film-details__term">${genreNoun}</td>
        <td class="film-details__cell">${filmGenres}</td>
      </tr>
    </table>

    <p class="film-details__film-description">${description}</p>
  </div>
  </div>
`);
};

export default class MoviePopupInfoView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMoviePopupInfoTemplate(this.#movie);
  }
}
