import dayjs from 'dayjs';

interface ITwitterLinkOptions {
  date?: string;
  startDate?: string;
  endDate?: string;
  lang?: string;
  username?: string;
}

export const getTwitterLink = (
  searchName: string,
  { date, startDate, endDate, lang, username }: ITwitterLinkOptions
) => {
  let queryString = searchName;

  if (lang) {
    queryString += ` lang:${lang}`;
  }
  if (username) {
    queryString += ` (from:${username})`;
  }
  if (startDate) {
    const sinceDate = dayjs(startDate).startOf('day').format('YYYY-MM-DD');
    queryString += ` since:${sinceDate}`;
  }
  if (endDate) {
    const untilDate = dayjs(endDate).startOf('day').format('YYYY-MM-DD');
    queryString += ` until:${untilDate}`;
  }
  if (date) {
    const sinceDate = dayjs(date).startOf('day').format('YYYY-MM-DD');
    const untilDate = dayjs(date).add(1, 'day').startOf('day').format('YYYY-MM-DD');
    queryString += ` since:${sinceDate} until:${untilDate}`;
  }

  return `https://twitter.com/search?q=${queryString}&src=typed_query`;
};
