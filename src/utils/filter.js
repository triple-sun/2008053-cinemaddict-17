import { FilterType } from '../const';
import { sortFilmsByRatingDown, sortMoviesByCommentsCount } from './movie';

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [FilterType.TOP_RATED]: (movies) => movies.sort(sortFilmsByRatingDown).slice(0, 2),
  [FilterType.MOST_COMMENTED]: (movies) => movies.sort(sortMoviesByCommentsCount).slice(0, 2)
};

export {filter};
