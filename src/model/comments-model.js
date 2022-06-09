import Observable from '../framework/observable.js';
import { ErrorType, UpdateType } from '../const.js';

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

  addComment = (updateType, newComment) => {
    this.#movie.comments = [
      newComment.id,
      ...this.#movie.comments,
    ];

    this._notify(updateType, this.#movie);
  };

  deleteComment = (updateType, commentID) => {
    const index = this.#movie.comments.findIndex((comment) => comment === commentID);

    this.#movie.comments = [
      ...this.#movie.comments.slice(0, index),
      ...this.#movie.comments.slice(index + 1),
    ];

    this._notify(updateType, this.#movie);
  };
}
