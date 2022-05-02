import { getRandomInteger, getRandomIndex, generateSentences } from '../util.js';
import { MAX_COMMENT_ID, MAX_SENTENCES, EMOJIS } from '../const.js';

const generateComment = () => {
  const COMMENT = generateSentences(MAX_SENTENCES);
  const ID = getRandomInteger(0, MAX_COMMENT_ID);
  const EMOTION = getRandomIndex(EMOJIS);

  return {
    id: ID,
    author: 'Ilya O\'Reilly',
    comment: COMMENT,
    date: '2019-05-11T16:12:32.554Z',
    emotion: EMOTION
  };};

const COMMENTS = Array.from({length: MAX_COMMENT_ID}, generateComment);

export { COMMENTS, generateComment };
