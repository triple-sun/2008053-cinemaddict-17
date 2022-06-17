import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};
const filterMoviesWithComments = (movies) => movies.filter((movie) => movie.comments.length > 0);

const filterMoviesWithRating = (movies) => movies.filter((movie) => Number(movie.filmInfo.totalRating) > 0);

export {
  filter,
  filterMoviesWithComments,
  filterMoviesWithRating
};
