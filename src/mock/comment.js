import { getRandomIndex, getRandomDate, generateSentences } from '../utils/common.js';
import { MAX_SENTENCES, EMOJIS, MAX_COMMENTS_TOTAL} from '../const.js';
import { nanoid } from 'nanoid';

const generateComment = (comment = generateSentences(MAX_SENTENCES), date = getRandomDate(), emotion = getRandomIndex(EMOJIS)) => ({
  id: nanoid(),
  author: 'Ilya O\'Reilly',
  comment: comment,
  date: date,
  emotion: emotion
});

const ALL_COMMENTS = Array.from({length: MAX_COMMENTS_TOTAL}, generateComment);

export {
  ALL_COMMENTS,
  generateComment
};
