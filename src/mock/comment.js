import { getRandomIndex, getRandomDate, generateSentences } from '../utils/common.js';
import { MAX_COMMENT_ID, MAX_SENTENCES, MIN_YEAR, MAX_YEAR, EMOJIS } from '../const.js';
import { nanoid } from 'nanoid';

const generateComment = (comment = generateSentences(MAX_SENTENCES), date = `${getRandomDate(MIN_YEAR, MAX_YEAR)}`, emotion = getRandomIndex(EMOJIS) ) => ({
  id: nanoid(),
  author: 'Ilya O\'Reilly',
  comment: comment,
  date: date,
  emotion: emotion
});

const COMMENTS = Array.from({length: MAX_COMMENT_ID}, generateComment);

export { COMMENTS, generateComment };
