import { getRandomIndex, getRandomDate, generateSentences } from '../utils/common.js';
import { MAX_COMMENT_ID, MAX_SENTENCES, MIN_YEAR, MAX_YEAR, EMOJIS } from '../const.js';
import { nanoid } from 'nanoid';

const generateComment = () => ({
  id: nanoid(MAX_COMMENT_ID),
  author: 'Ilya O\'Reilly',
  comment: generateSentences(MAX_SENTENCES),
  date: `${getRandomDate(MIN_YEAR, MAX_YEAR)}`,
  emotion: getRandomIndex(EMOJIS)
});

const COMMENTS = Array.from({length: MAX_COMMENT_ID}, generateComment);

export { COMMENTS };
