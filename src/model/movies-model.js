import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import { convertSnakeCaseKeysToCamelCase, findItemIndexByID } from '../utils/common.js';

export default class MoviesModel extends Observable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#movies = [];
      this._notify(UpdateType.FAIL);
    }
  };

  updateMovie = async (updateType, update) => {
    const index = findItemIndexByID(this.#movies, update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, {
        updatedMovie: updatedMovie,
        updatedMovies: this.#movies
      });
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  #adaptToClient = (movie) => convertSnakeCaseKeysToCamelCase(movie);
}

