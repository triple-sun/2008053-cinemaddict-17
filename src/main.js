import MoviesSectionPresenter from './presenter/movies-section-presenter.js';
import MoviesModel from './model/movies-model.js';
import UserPresenter from './presenter/user-title-presenter.js';
import FilmsFiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './movies-api-service.js';
import CommentsModel from './model/comments-model.js';
import { AUTHORIZATION, END_POINT, pageBody } from './const.js';

const pageHeaderSection = pageBody.querySelector('.header');
const pageMainSection = pageBody.querySelector('.main');

const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(moviesApiService);
const commentsModel = new CommentsModel(moviesApiService);
const filterModel = new FilterModel();

const userPresenter = new UserPresenter(pageHeaderSection);
const navigationPresenter = new FilmsFiltersPresenter(pageMainSection, moviesModel, filterModel);
const filmsSectionPresenter = new MoviesSectionPresenter(pageMainSection, moviesModel, filterModel, commentsModel);

userPresenter.init();
navigationPresenter.init();
filmsSectionPresenter.init();
moviesModel.init();
