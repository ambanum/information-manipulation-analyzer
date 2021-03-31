import languages from '../data/languages.json';

export const get = (code: string) => {
  return languages.find((language) => language._id === code.toLowerCase());
};

export const getName = (code: string) => {
  return get(code)?.name || code;
};
