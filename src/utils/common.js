//https://stackoverflow.com/a/59769834
const toCamel = (str) => str
  .replace(
    /([-_][a-z])/ig, ($1) => $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

const toSnake = (str) => str
  .replace(
    /([A-Z])/g, ($1)=> `_${$1
      .toLowerCase()}`
  );

const isObject = (obj) => obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';

const snakeCaseKeysToCamelCase = (obj) => {
  if (isObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[toCamel(k)] = snakeCaseKeysToCamelCase(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => snakeCaseKeysToCamelCase(i));
  }

  return obj;
};

const camelCaseKeysToSnakeCase = (obj) => {
  if (isObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[toSnake(k)] = camelCaseKeysToSnakeCase(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => camelCaseKeysToSnakeCase(i));
  }

  return obj;
};

export {
  snakeCaseKeysToCamelCase,
  camelCaseKeysToSnakeCase
};
