import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((film) => film.userDetails.favorite)
};

export {filter};
