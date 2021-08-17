import * as LanguageManager from 'modules/Countries/managers/LanguageManager';
import * as QueueItemManager from './QueueItemManager';

import SearchModel, { SearchTypes } from '../models/Search';

import { Search } from '../interfaces';
import SearchVolumetryModel from '../models/SearchVolumetry';
import { VolumetryGraphProps } from '../components/Charts/VolumetryGraph.d';
import dayjs from 'dayjs';

const MIN_NB_OCCURENCES = 1;
const MIN_NB_RECORDS = 1000;

export const create = async ({ name, type }: { name: string; type: keyof typeof SearchTypes }) => {
  try {
    const search = new SearchModel({ name, status: 'PENDING', type });
    await search.save();

    await QueueItemManager.createFirstFetch(search._id);
    return search;
  } catch (e) {
    console.error(e);
    throw new Error('Could not create search');
  }
};

export const get = async (filter: { name: string }) => {
  try {
    const search: Search = await SearchModel.findOne(filter)
      .populate({ path: 'volumetry', options: { sort: { date: 1 } } })
      .lean({ virtuals: true });

    return search;
  } catch (e) {
    console.error(e);
    throw new Error(`Could not find search ${filter.name}`);
  }
};

export const list = async ({ limit }: { limit: number } = { limit: 100 }) => {
  try {
    const searches: Search[] = await SearchModel.find().sort({ name: 1 }).limit(limit);

    return searches;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find searches');
  }
};

export const listForPrerendering = async (
  { limit, maxVolumetry }: { limit: number; maxVolumetry: number } = {
    limit: 100,
    maxVolumetry: 10000,
  }
) => {
  try {
    const searches: Search[] = await SearchVolumetryModel.aggregate([
      {
        $group: {
          _id: '$search',
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $lte: maxVolumetry } } },
      {
        $lookup: {
          from: 'searches',
          localField: '_id',
          foreignField: '_id',
          as: 'search',
        },
      },
      { $unwind: '$search' },
      { $project: { count: 1, name: '$search.name' } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]).exec();
    return searches;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find searches');
  }
};

export const getWithData = async ({
  name,
  min,
  max,
}: {
  name: string;
  min?: string;
  max?: string;
}) => {
  try {
    const search = await get({ name });

    const usernames: { [key: string]: number } = {};
    const languages: { [key: string]: number } = {};
    const associatedHashtags: { [key: string]: number } = {};
    let totalNbTweets: number = 0;
    let i = 0;
    const volumetryLength = search.volumetry.length;

    const volumetry = search.volumetry.reduce(
      (acc: VolumetryGraphProps['data'], volumetry) => {
        const newAcc = [...acc];

        const volumetryDate = volumetry.date;
        const volumetryDayJs = dayjs(volumetry.date);

        if (i > 0) {
          const volumetryDatePrevHour = volumetryDayJs.add(-1, 'hour').toDate();

          if (volumetryDatePrevHour.toISOString() !== search.volumetry[i - 1]?.date.toISOString()) {
            newAcc[0].data.push({ x: volumetryDatePrevHour, y: 0 });
            newAcc[1].data.push({ x: volumetryDatePrevHour, y: 0 });
            newAcc[2].data.push({ x: volumetryDatePrevHour, y: 0 });
            newAcc[3].data.push({ x: volumetryDatePrevHour, y: 0 });
          }
        }

        newAcc[0].data.push({ x: volumetryDate, y: volumetry.nbTweets || 0 });
        newAcc[1].data.push({ x: volumetryDate, y: volumetry.nbRetweets || 0 });
        newAcc[2].data.push({ x: volumetryDate, y: volumetry.nbLikes || 0 });
        newAcc[3].data.push({ x: volumetryDate, y: volumetry.nbQuotes || 0 });

        if (i < volumetryLength - 1) {
          const volumetryDateNextHour = dayjs(volumetry.date).add(1, 'hour').toDate();
          if (volumetryDateNextHour.toISOString() !== search.volumetry[i + 1]?.date.toISOString()) {
            newAcc[0].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[1].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[2].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[3].data.push({ x: volumetryDateNextHour, y: 0 });
          }
        }
        i++;

        if (
          (!min && !max) ||
          (min &&
            max &&
            volumetryDayJs.isAfter(dayjs(+min)) &&
            volumetryDayJs.isBefore(dayjs(+max)))
        ) {
          Object.keys(volumetry.languages || {}).forEach((language) => {
            languages[language] = (languages[language] || 0) + volumetry.languages[language];
          });
          Object.keys(volumetry.usernames || {}).forEach((username) => {
            usernames[username] = (usernames[username] || 0) + volumetry.usernames[username];
          });
          Object.keys(volumetry.associatedHashtags || {}).forEach((associatedSearch) => {
            associatedHashtags[associatedSearch] =
              (associatedHashtags[associatedSearch] || 0) +
              volumetry.associatedHashtags[associatedSearch];
          });
          totalNbTweets += volumetry.nbTweets;
        }
        return acc;
      },
      [
        { id: 'nbTweets', data: [] },
        { id: 'nbRetweets', data: [] },
        { id: 'nbLikes', data: [] },
        { id: 'nbQuotes', data: [] },
      ]
    );

    // @ts-ignore We do not use it anymore as it has been reprocessed already
    delete search.volumetry;

    const usernameKeys = Object.keys(usernames);
    const nbUsernames = usernameKeys.length;
    const filteredUsernames = usernameKeys
      .filter((username) => nbUsernames < MIN_NB_RECORDS || usernames[username] > MIN_NB_OCCURENCES)
      .map((username) => ({
        id: username,
        label: username,
        value: usernames[username],
      }));

    const associatedHashtagsKeys = Object.keys(associatedHashtags);
    const nbAssociatedHashtags = associatedHashtagsKeys.length;
    const filteredAssociatedSearchs = associatedHashtagsKeys
      .filter(
        (associatedSearch) =>
          nbAssociatedHashtags < MIN_NB_RECORDS ||
          associatedHashtags[associatedSearch] > MIN_NB_OCCURENCES
      )
      .map((associatedSearch) => ({
        id: associatedSearch,
        label: associatedSearch,
        value: associatedHashtags[associatedSearch],
      }));

    const result = {
      search: search ? search : null,
      volumetry,
      totalNbTweets,
      languages: Object.keys(languages).map((language) => ({
        id: language,
        label: LanguageManager.getName(language),
        value: languages[language],
      })),
      nbUsernames,
      usernames: filteredUsernames,
      nbAssociatedHashtags,
      associatedHashtags: filteredAssociatedSearchs,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find search in getWithData');
  }
};
