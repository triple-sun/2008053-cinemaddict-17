import { MOCK_SENTENCES } from '../const.js';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
//Функция взята со StackOverflow: https://stackoverflow.com/questions/17726753/get-a-random-number-between-0-0200-and-0-120-float-numbers и доработана
const getRandomFloat = (a, b, decimal = 1) => {
  const min = Math.min(Math.abs(a), Math.abs(b));
  const max = Math.max(Math.abs(a), Math.abs(b));

  return Number(Math.random() * (max - min) + min).toFixed(decimal);
};

//https://stackoverflow.com/a/46382735
const getRandomIntegerArray = (length, max) => Array(length).fill().map(() => Math.round(Math.random() * max));

const getRandomBoolean = () => Math.random() < 0.5;

const getRandomIndex = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const getRandomArrayElements = (arr, amount) => {
  const elements = [];
  for (let i = 0; i <= amount; i++) {
    elements.push(getRandomIndex(arr));
  }
  return elements;
};

//https://gist.github.com/miguelmota/5b67e03845d840c949c4
const getRandomDate = (startYear, endYear) => {
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(endYear, 0, 1);
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

const generateSentences = (amount) => getRandomArrayElements(MOCK_SENTENCES, amount).join(' ');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger, getRandomFloat, getRandomIntegerArray, getRandomBoolean, getRandomIndex, getRandomDate, generateSentences, updateItem};
