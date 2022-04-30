import { COMMENTS } from '../mock/comment.js';

const getCommentByID = (id) => COMMENTS[id];

export default class Comments {
  constructor(film) {
    this.comments = film.comments.map(getCommentByID);
  }

  getComments = () => this.comments;
}
