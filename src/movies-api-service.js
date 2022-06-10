import ApiService from './framework/api-service.js';
import { camelCaseKeysToSnakeCase } from './utils/common.js';

const MOVIES_URL = 'movies';
const COMMENTS_URL = 'comments';
const HEADERS_DATA = {'Content-Type': 'application/json'};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: MOVIES_URL})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `${MOVIES_URL}/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers(HEADERS_DATA),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  getComments = (movie) => this._load({url: `${COMMENTS_URL}/${movie.id}`})
    .then(ApiService.parseResponse);


  addComment = async (movie, comment) => {
    const response = await this._load({
      url: `${COMMENTS_URL}/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(comment)),
      headers: new Headers(HEADERS_DATA),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (commentID) => {
    const response = await this._load({
      url: `${COMMENTS_URL}/${commentID}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptToServer = (movie) => camelCaseKeysToSnakeCase(movie);
}
