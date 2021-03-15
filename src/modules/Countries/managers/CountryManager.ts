import countries from '../data/countries.json';

export const get = (code: string) => {
  return countries.find((country) => country._id === code.toLowerCase());
};

export const getName = (code: string) => {
  return get(code)?.name;
};
