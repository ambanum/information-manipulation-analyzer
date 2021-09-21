import * as LanguageManager from 'modules/Countries/managers/LanguageManager';
import * as QueueItemManager from './QueueItemManager';

import SearchModel, { SearchTypes } from '../models/Search';

import { Search } from '../interfaces';
import TweetModel from '../models/Tweet';
import { VolumetryGraphProps } from '../components/Charts/VolumetryGraph.d';
import dayjs from 'dayjs';
import sumBy from 'lodash/fp/sumBy';

interface SearchFilter {
  searchIds: string[];
  startDate?: string;
  endDate?: string;
}

const getMatch = ({ searchIds, startDate, endDate }: SearchFilter) => {
  const match: any = { searches: { $in: searchIds } };
  if (startDate || endDate) {
    match.hour = {};
    if (startDate) {
      match.hour.$gte = new Date(dayjs(+startDate).toISOString());
    }
    if (endDate) {
      match.hour.$lte = new Date(dayjs(+endDate).toISOString());
    }
  }

  return match;
};

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
      // .populate({ path: 'volumetry', options: { sort: { date: 1 } } })
      .lean({ virtuals: true });

    return search;
  } catch (e) {
    console.error(e);
    throw new Error(`Could not find search ${filter.name}`);
  }
};

export const getVolumetry = async (filter: SearchFilter) => {
  const match: any = getMatch(filter);

  const aggregation = [
    {
      $match: match,
    },
    {
      $addFields: {
        hashtags: {
          $ifNull: ['$hashtags', []],
        },
      },
    },
    {
      $group: {
        _id: {
          hour: '$hour',
        },
        nbTweets: {
          $sum: 1,
        },
        nbRetweets: {
          $sum: '$retweetCount',
        },
        nbQuotes: {
          $sum: '$retweetCount',
        },
        nbLikes: {
          $sum: '$likeCount',
        },
        usernames: {
          $push: '$username',
        },
        hashtags: {
          $push: '$hashtags',
        },
      },
    },
    {
      $sort: {
        '_id.hour': 1,
      },
    },
    {
      $addFields: {
        hashtags: {
          $reduce: {
            input: '$hashtags',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    },
    {
      $addFields: {
        hashtags: {
          $arrayToObject: [
            {
              $map: {
                input: '$hashtags',
                as: 'hash',
                in: {
                  k: '$$hash',
                  v: {
                    $reduce: {
                      input: '$hashtags',
                      initialValue: 0,
                      in: {
                        $cond: [
                          {
                            $eq: ['$$hash', '$$this'],
                          },
                          {
                            $add: ['$$value', 1],
                          },
                          '$$value',
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        usernames: {
          $arrayToObject: [
            {
              $map: {
                input: '$usernames',
                as: 'user',
                in: {
                  k: '$$user',
                  v: {
                    $reduce: {
                      input: '$usernames',
                      initialValue: 0,
                      in: {
                        $cond: [
                          {
                            $eq: ['$$user', '$$this'],
                          },
                          {
                            $add: ['$$value', 1],
                          },
                          '$$value',
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults.map((rawResult: any) => ({
    hour: rawResult._id.hour,
    nbTweets: rawResult.nbTweets,
    nbRetweets: rawResult.nbRetweets,
    nbQuotes: rawResult.nbQuotes,
    nbLikes: rawResult.nbLikes,
    usernames: rawResult.usernames,
    associatedHashtags: rawResult.hashtags,
  }));
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
    const searches: Search[] = await TweetModel.aggregate([
      { $unwind: '$searches' },
      {
        $group: {
          _id: {
            hour: '$hour',
            searches: '$searches',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $group: {
          _id: '$_id.searches',
          count: {
            $sum: 1,
          },
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
      {
        $unwind: '$search',
      },
      { $project: { count: 1, name: '$search.name' } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]).allowDiskUse(true);

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

    if (!search) {
      return null;
    }
    const filters: any = {
      searchIds: [search._id],
    };
    if (min) filters.startDate = min;
    if (max) filters.endDate = max;

    const searchVolumetry = await getVolumetry(filters);
    console.timeEnd(`get searchVolumetry for ${name}`);

    let nbTweets: number = 0;
    const usernames: { [key: string]: number } = {};
    const associatedHashtags: { [key: string]: number } = {};
    let i = 0;
    const volumetryLength = searchVolumetry.length;

    const volumetry = searchVolumetry.reduce(
      (acc: VolumetryGraphProps['data'], volumetry) => {
        const newAcc = [...acc];

        const volumetryDate = volumetry.hour;
        const volumetryDayJs = dayjs(volumetryDate);

        if (i > 0) {
          const volumetryDatePrevHour = volumetryDayJs.add(-1, 'hour').toDate();

          if (volumetryDatePrevHour.toISOString() !== searchVolumetry[i - 1]?.hour.toISOString()) {
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
          const volumetryDateNextHour = volumetryDayJs.add(1, 'hour').toDate();
          if (volumetryDateNextHour.toISOString() !== searchVolumetry[i + 1]?.hour.toISOString()) {
            newAcc[0].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[1].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[2].data.push({ x: volumetryDateNextHour, y: 0 });
            newAcc[3].data.push({ x: volumetryDateNextHour, y: 0 });
          }
        }
        i++;

        // Calculate number of users
        Object.keys(volumetry.usernames || {}).forEach((username) => {
          usernames[username] = (usernames[username] || 0) + volumetry.usernames[username];
        });

        // Calculate number of users
        Object.keys(volumetry.associatedHashtags || {}).forEach((associatedSearch) => {
          associatedHashtags[associatedSearch] =
            (associatedHashtags[associatedSearch] || 0) +
            volumetry.associatedHashtags[associatedSearch];
        });

        // Calculate number of tweets
        nbTweets += volumetry.nbTweets;

        return acc;
      },
      [
        { id: 'nbTweets', data: [] },
        { id: 'nbRetweets', data: [] },
        { id: 'nbLikes', data: [] },
        { id: 'nbQuotes', data: [] },
      ]
    );

    const nbAssociatedHashtags = Object.keys(associatedHashtags).length;

    const nbUsernames = Object.keys(usernames).length;

    const result = {
      search: search ? search : null,
      volumetry,
      nbTweets,
      nbUsernames,
      nbAssociatedHashtags,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error(`Could not find search in getWithData for ${name}`);
  }
};

export const getLanguages = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          lang: '$lang',
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ];
  const rawResults: any[] = await TweetModel.aggregate(aggregation);
  const nbLanguages = sumBy('count')(rawResults);

  return rawResults.map((rawResult: any) => ({
    id: rawResult._id.lang,
    label: LanguageManager.getName(rawResult._id.lang),
    value: rawResult.count,
    percentage: rawResult.count / nbLanguages,
  }));
};

export const getHashtags = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    { $unwind: '$hashtags' },
    {
      $group: {
        _id: {
          hashtag: '$hashtags',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);
  const nbHashtags = sumBy('count')(rawResults);

  return rawResults.map((rawResult: any) => ({
    id: rawResult._id.hashtag,
    label: rawResult._id.hashtag,
    value: rawResult.count,
    percentage: rawResult.count / nbHashtags,
  }));
};

export const countHashtags = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    { $unwind: '$hashtags' },
    {
      $group: {
        _id: '$hashtags',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ];
  const rawResults: any[] = await TweetModel.aggregate(aggregation);

  return rawResults[0]?.count;
};

export const getUsernames = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    {
      $group: {
        _id: '$username',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  const nbUsernames = sumBy('count')(rawResults);
  return rawResults.map((rawResult: any) => ({
    id: rawResult._id,
    label: rawResult._id,
    value: rawResult.count,
    percentage: rawResult.count / nbUsernames,
  }));
};

export const countUsernames = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    {
      $group: {
        _id: '$username',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation);

  return rawResults[0]?.count;
};

export const splitRequests = async ({
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

    if (!search) {
      return null;
    }

    const match: any = getMatch({
      searchIds: [search._id],
      startDate: min,
      endDate: max,
    });
    const nbTweets = await TweetModel.count(match);
    const batchNumber = 20000;
    const nbBatches = Math.ceil(nbTweets / batchNumber);

    let periods = [];
    let previousHour = null;
    if (nbTweets <= batchNumber) {
      periods = [{ endDate: match?.hour?.$lte, startDate: match?.hour?.$gte }];
    } else {
      for (let i = 1; i <= nbBatches; i++) {
        const lastRequest = i === nbBatches;

        const paginationMatch: any = previousHour
          ? { ...match, hour: { ...(match.hour || {}), $lte: new Date(previousHour) } }
          : match;

        const aggregation: any = lastRequest
          ? [{ $sort: { hour: 1 } }, { $match: match }, { $limit: 1 }]
          : [
              { $sort: { hour: -1 } },
              { $match: paginationMatch },
              { $skip: batchNumber },
              { $limit: 1 },
            ];

        try {
          const [tweet] = await TweetModel.aggregate(aggregation).exec();

          if (!tweet) {
            break;
          }

          const { hour } = tweet;

          if (i === 1) {
            periods.push({ startDate: hour, endDate: match?.hour?.$lte });
          } else if (i === nbBatches) {
            periods.push({ endDate: previousHour, startDate: match?.hour?.$gte });
          } else {
            periods.push({ startDate: hour, endDate: previousHour });
          }
          previousHour = dayjs(hour).add(-1, 'hour').toDate();
        } catch (e) {
          console.error(e);
          // we did a wrong iteration
          break;
        }
      }
    }
    return { search, nbTweets, periods };
  } catch (e) {
    console.error(e);
    throw new Error(`Could not find search in getWithData for ${name}`);
  }
};
