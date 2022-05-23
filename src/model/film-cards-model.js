import { MAX_FILMS } from '../const.js';
import { generateFilm } from '../mock/film.js';

export default class FilmCardsModel {
  #films = Array.from({length: MAX_FILMS}, generateFilm);

  get films() {
    return this.#films;
  }
}

