import { MAX_FILMS } from '../const.js';
import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: MAX_FILMS}, generateFilm);

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

