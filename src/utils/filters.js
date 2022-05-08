import { FilterType } from '../const';

const isWatched = (film) => film.userDetails.alreadyWatched;

const isFavourite = (film) => film.userDetails.favourite;

const isInWatchlist = (film) => film.userDetails.watchlist;

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter(isInWatchlist),
  [FilterType.HISTORY]: (films) => films.filter(isWatched),
  [FilterType.FAVOURITES]: (films) => films.filter(isFavourite)
};

export { isWatched, isFavourite, isInWatchlist, filter};
