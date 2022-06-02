import { getRandomInteger, getRandomIndex, getRandomFloat, getRandomBoolean, generateSentences, getRandomDate, getRandomArrayElements } from '../utils/common.js';
import { MAX_COMMENTS_PER_FILM, MAX_SENTENCES, MOCK_TITLES } from '../const.js';
import { nanoid } from 'nanoid';
import { ALL_COMMENTS } from './comment.js';

const MAX_RATING = 10;
const MAX_AGE = 18;
const MIN_RUNTIME = 60;
const MAX_RUNTIME = 240;

const getPosterURLFromTitle = (title) => `images/posters/${  title.replace(/ /gi, '-').toLowerCase()  }.jpg`;

const generateFilm = () => {
  const commentQuantity = getRandomInteger(0, MAX_COMMENTS_PER_FILM);
  const title = getRandomIndex(MOCK_TITLES);
  const poster = getPosterURLFromTitle(title);
  const releaseDate = getRandomDate();

  return {
    id: nanoid(),
    comments: getRandomArrayElements(ALL_COMMENTS, commentQuantity).map((comment) => comment.id),
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
        date: `${releaseDate}`,
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
      watchingDate: getRandomDate(),
      favorite: getRandomBoolean()
    }
  };
};
export {generateFilm};

