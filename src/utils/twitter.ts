import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
dayjs.extend(advancedFormat);
interface ITwitterLinkOptions {
  date?: string;
  startDate?: string;
  endDate?: string;
  asTime?: boolean;
  lang?: string;
  username?: string;
}

export const getTwitterLink = (
  searchName: string = '',
  { date, startDate, endDate, lang, username, asTime }: ITwitterLinkOptions
) => {
  let queryString = searchName;
  const format = asTime ? 'X' : 'YYYY-MM-DD';
  const since = asTime ? 'since_time' : 'since';
  const until = asTime ? 'until_time' : 'until';
  const timeframe = asTime ? 'hour' : 'day';

  if (lang) {
    queryString += ` lang:${lang}`;
  }
  if (username) {
    queryString += ` (from:${username})`;
  }
  if (startDate) {
    const sinceDate = dayjs(startDate).startOf(timeframe).format(format);
    queryString += ` ${since}:${sinceDate}`;
  }
  if (endDate) {
    const untilDate = dayjs(endDate)
      .startOf(timeframe)
      .add(1, timeframe)
      .startOf(timeframe)
      .format(format);
    queryString += ` ${until}:${untilDate}`;
  }
  if (date) {
    const sinceDate = dayjs(date).startOf(timeframe).format(format);
    const untilDate = dayjs(date).add(1, timeframe).startOf(timeframe).format(format);
    queryString += ` ${since}:${sinceDate} ${until}:${untilDate}`;
  }

  queryString = encodeURI(queryString).replace('#', '%23');
  return `https://twitter.com/search?q=${queryString}&src=typed_query`;
};

export const getTweetIntentLink = (text: string) => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};
