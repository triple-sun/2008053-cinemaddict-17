import { filter } from '../utils/filters.js';

const generateFilter = (films) => Object.entries(filter)
  .map(([filterName, filterFilms]) => ({
    name: filterName,
    target: `#${filterName.toLowerCase()}`,
    filmsList: filterFilms,
    count: filterFilms(films).length,
  }),
  );

export {generateFilter};
