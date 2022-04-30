import { getRandomInteger, getRandomIndex, getRandomFloat, getRandomIntegerArray, generateSentences } from '../util.js';
import { MAX_COMMENT_ID, MAX_COMMENTS, MAX_SENTENCES, MOCK_TITLES } from '../const.js';

const MAX_FILM_ID = 100;

const MAX_RATING = 10;
const MAX_AGE = 18;
const MIN_RUNTIME = 60;
const MAX_RUNTIME = 240;
const MIN_YEAR = 1940;
const MAX_YEAR = 2022;

const getPosterURLFromTitle = (title) => `images/posters/${  title.replace(/ /gi, '-').toLowerCase()  }.jpg`;

export const generateFilm = () => {
  const ID = String(getRandomInteger(0, MAX_FILM_ID));
  const COMMENT_QUANTITY = getRandomInteger(0, MAX_COMMENTS);
  const COMMENT_IDS = getRandomIntegerArray(COMMENT_QUANTITY, MAX_COMMENT_ID);
  const TITLE = getRandomIndex(MOCK_TITLES);
  const POSTER = getPosterURLFromTitle(TITLE);
  const RATING = String(getRandomFloat(0, MAX_RATING));
  const AGE_RATING = getRandomInteger(0, MAX_AGE);
  const RUNTIME = getRandomInteger(MIN_RUNTIME, MAX_RUNTIME);
  const DESCRIPTION = generateSentences(getRandomInteger(1, MAX_SENTENCES));
  const YEAR = getRandomInteger(MIN_YEAR, MAX_YEAR);

  return {
    id: ID,
    comments: COMMENT_IDS,
    filmInfo: {
      title: TITLE,
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: RATING,
      poster: POSTER,
      ageRating: AGE_RATING,
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman'
      ],
      release: {
        date: `${YEAR}-05-11T00:00:00.000Z`,
        releaseCountry: 'Finland'
      },
      runtime: RUNTIME,
      genre: [
        'Comedy'
      ],
      description: DESCRIPTION
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: false
    }
  };
};
