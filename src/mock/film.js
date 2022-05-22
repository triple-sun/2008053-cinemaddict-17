import { getRandomInteger, getRandomIndex, getRandomFloat, getRandomIntegerArray, getRandomBoolean, getRandomDate, generateSentences } from '../utils/common.js';
import { MAX_COMMENT_ID, MAX_COMMENTS, MAX_SENTENCES, MIN_YEAR, MAX_YEAR, MOCK_TITLES } from '../const.js';
import { nanoid } from 'nanoid';

const MAX_RATING = 10;
const MAX_AGE = 18;
const MIN_RUNTIME = 60;
const MAX_RUNTIME = 240;

const getPosterURLFromTitle = (title) => `images/posters/${  title.replace(/ /gi, '-').toLowerCase()  }.jpg`;

const generateFilm = () => {
  const commentQuantity = getRandomInteger(0, MAX_COMMENTS);
  const title = getRandomIndex(MOCK_TITLES);
  const poster = getPosterURLFromTitle(title);

  return {
    id: nanoid(MAX_COMMENT_ID),
    comments: getRandomIntegerArray(commentQuantity, MAX_COMMENT_ID),
    filmInfo: {
      title: title,
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: String(getRandomFloat(0, MAX_RATING)),
      poster: poster,
      ageRating: getRandomInteger(0, MAX_AGE),
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman'
      ],
      release: {
        date: `${getRandomDate(MIN_YEAR, MAX_YEAR)}`,
        releaseCountry: 'Finland'
      },
      runtime: getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
      genre: [
        'Comedy',
        'Thriller'
      ],
      description: generateSentences(getRandomInteger(1, MAX_SENTENCES))
    },
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: `${getRandomDate(MIN_YEAR, MAX_YEAR)}`,
      favourite: getRandomBoolean()
    }
  };
};
export {generateFilm};

