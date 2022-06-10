import Observable from '../framework/observable.js';
import { ErrorType, UpdateType } from '../const.js';
import { snakeCaseKeysToCamelCase } from '../utils/common.js';

export default class CommentsModel extends Observable {
  #moviesApiService = null;
  #movie = null;
  #comments = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (movie) => {
    this.#movie = movie;
    try {
      this.#comments = await this.#moviesApiService.getComments(movie);
    } catch(err) {
      this.#comments = ErrorType.COMMENTS_ERROR;
    }
    this._notify(UpdateType.INIT, this.#movie);
  };

  addComment = async (updateType, comment) => {
    try {
      const response = await this.#moviesApiService.addComment(this.#movie, comment);
      this.#comments = [...this.#adaptToClient(response).comments];
      this._notify(updateType, this.#adaptToClient(response).movie);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, commentID) => {
    const index = this.#movie.comments.findIndex((comment) => comment === commentID);

    try {
      await this.#moviesApiService.deleteComment(commentID);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, this.#movie);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => snakeCaseKeysToCamelCase(comment);
}
