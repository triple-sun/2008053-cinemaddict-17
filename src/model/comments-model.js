import Observable from '../framework/observable.js';
import { ALL_COMMENTS } from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get comments() {
    return this.#film.comments.map((id) => ALL_COMMENTS.find((element) => element.id === id));
  }

  addComment = (updateType, newComment) => {
    this.#film.comments = [
      newComment.id,
      ...this.#film.comments,
    ];

    ALL_COMMENTS.push(newComment);

    this._notify(updateType, this.#film);
  };

  deleteComment = (updateType, commentID) => {
    const index = this.#film.comments.findIndex((comment) => comment === commentID);

    this.#film.comments = [
      ...this.#film.comments.slice(0, index),
      ...this.#film.comments.slice(index + 1),
    ];

    this._notify(updateType, this.#film);
  };
}
