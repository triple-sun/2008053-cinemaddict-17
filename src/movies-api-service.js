import ApiService from './framework/api-service.js';
import { camelCaseKeysToSnakeCase } from './utils/common.js';

const MOVIES_URL = 'movies';
const COMMENTS_URL = 'comments';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: MOVIES_URL})
      .then(ApiService.parseResponse);
  }

  getComments = (movie) => this._load({url: `${COMMENTS_URL}/${movie.id}`})
    .then(ApiService.parseResponse);

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `${MOVIES_URL}/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (movie) => camelCaseKeysToSnakeCase(movie);
}
