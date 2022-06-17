import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import { convertSnakeCaseKeysToCamelCase, findItemIndexByID } from '../utils/common.js';

export default class CommentsModel extends Observable {
  #moviesApiService = null;
  #movie = null;
  #comments = [];
  #failedToLoadComments = false;

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get comments() {
    return this.#comments;
  }

  get hadFailed() {
    return this.#failedToLoadComments;
  }

  init = async (movie) => {
    this.#movie = movie;
    try {
      this.#comments = await this.#moviesApiService.getComments(movie);
      this.#failedToLoadComments = false;
    } catch (err) {
      this.#comments = [];
      this.#failedToLoadComments = true;
    }
    this._notify(UpdateType.INIT, this.#movie);
  };

  addComment = async (updateType, comment) => {
    try {
      const response = await this.#moviesApiService.addComment(this.#movie, comment);
      this.#comments = [...this.#adaptToClient(response).comments];
      this._notify(updateType, this.#comments);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, comment) => {
    const index = findItemIndexByID(this.#comments, comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#moviesApiService.deleteComment(comment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
    this._notify(updateType, this.#comments);

  };

  #adaptToClient = (comment) => convertSnakeCaseKeysToCamelCase(comment);
}
