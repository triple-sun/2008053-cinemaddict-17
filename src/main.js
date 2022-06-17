import MoviesSectionPresenter from './presenter/movies-section-presenter.js';
import MoviesModel from './model/movies-model.js';
import MoviesFiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './movies-api-service.js';
import CommentsModel from './model/comments-model.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();
const moviesModel = new MoviesModel(moviesApiService);
const commentsModel = new CommentsModel(moviesApiService);

const navigationPresenter = new MoviesFiltersPresenter(moviesModel, filterModel);
const moviesSectionPresenter = new MoviesSectionPresenter(moviesModel, filterModel, commentsModel);

moviesModel.init()
  .finally(navigationPresenter.init());
moviesSectionPresenter.init();
