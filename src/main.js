import MoviesSectionPresenter from './presenter/movies-section-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilmsFiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './movies-api-service.js';
import CommentsModel from './model/comments-model.js';
import { AUTHORIZATION, END_POINT, pageMainSection } from './const.js';

const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(moviesApiService);
const commentsModel = new CommentsModel(moviesApiService);
const filterModel = new FilterModel();

const navigationPresenter = new FilmsFiltersPresenter(pageMainSection, moviesModel, filterModel);
const filmsSectionPresenter = new MoviesSectionPresenter(pageMainSection, moviesModel, filterModel, commentsModel);

navigationPresenter.init();
filmsSectionPresenter.init();
moviesModel.init();
