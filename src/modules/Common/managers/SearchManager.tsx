import * as LanguageManager from 'modules/Countries/managers/LanguageManager';
import * as QueueItemManager from './QueueItemManager';

import { CommonGetFilters, Search } from '../interfaces';
import SearchModel, { SearchTypes } from '../models/Search';

import TweetModel from '../models/Tweet';
import dayjs from 'dayjs';
import sumBy from 'lodash/fp/sumBy';
export interface SearchFilter {
  searchIds: string[];
  startDate?: string;
  endDate?: string;
  lang?: string;
  username?: string;
  hashtag?: string;
  content?: string;
}

const getMatch = ({
  searchIds,
  startDate,
  endDate,
  lang,
  username,
  hashtag,
  content,
}: SearchFilter) => {
  const match: any = {};
  if (startDate || endDate) {
    match.hour = {};
    if (startDate) {
      match.hour.$gte = new Date(dayjs(+startDate).toISOString());
    }
    if (endDate) {
      match.hour.$lte = new Date(dayjs(+endDate).toISOString());
    }
  }
  if (lang) {
    match.lang = lang;
  }
  if (username) {
    match.username = username;
  }
  if (hashtag) {
    match.hashtags = hashtag;
  }
  if (content) {
    match.content = content;
  }

  match.searches = { $in: searchIds }; // first filter by date and then by searches as it is a multi key index

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
        nbReplies: {
          $sum: '$replyCount',
        },
      },
    },
    {
      $sort: {
        '_id.hour': 1,
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
    nbReplies: rawResult.nbReplies,
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
  lang,
  username,
  hashtag,
  content,
}: {
  name: string;
  min?: string;
  max?: string;
  lang?: string;
  username?: string;
  hashtag?: string;
  content?: string;
}) => {
  try {
    const search = await get({ name });

    if (!search) {
      return null;
    }
    const filters: any = {
      searchIds: [search._id],
      startDate: min,
      endDate: max,
      lang,
      username,
      hashtag,
      content,
    };

    const searchVolumetry = await getVolumetry(filters);

    let nbTweets: number = 0;
    let nbLikes: number = 0;
    let nbRetweets: number = 0;
    let nbReplies: number = 0;
    let nbQuotes: number = 0;

    searchVolumetry.forEach((volumetry) => {
      const volumetryDayJs = dayjs(volumetry.hour);

      if (
        (!min && !max) ||
        (min &&
          max &&
          volumetryDayJs.isAfter(dayjs(+min)) &&
          volumetryDayJs.isBefore(dayjs(+max))) ||
        (min && volumetryDayJs.isAfter(dayjs(+min))) ||
        (max && volumetryDayJs.isBefore(dayjs(+max)))
      ) {
        // Calculate number of tweets
        nbTweets += volumetry.nbTweets;
        nbLikes += volumetry.nbLikes;
        nbRetweets += volumetry.nbRetweets;
        nbReplies += volumetry.nbReplies;
        nbQuotes += volumetry.nbQuotes;
      }
    });

    const nbAssociatedHashtags = await countHashtags(filters);
    const nbUsernames = await countUsernames(filters);

    const result = {
      search: search ? search : null,
      volumetry: searchVolumetry,
      nbTweets,
      nbLikes,
      nbRetweets,
      nbReplies,
      nbQuotes,
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

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);
  const nbLanguages = sumBy('count')(rawResults);

  return rawResults.map((rawResult: any) => ({
    id: rawResult._id.lang,
    label: LanguageManager.getName(rawResult._id.lang),
    value: rawResult.count,
    percentage: rawResult.count / nbLanguages,
  }));
};

export const getHashtags = async (filters: SearchFilter, limit?: number) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    { $project: { hashtags: 1 } },
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

  return {
    count: rawResults.length,
    hashtags: rawResults.slice(0, limit).map((rawResult: any) => ({
      id: rawResult._id.hashtag,
      label: rawResult._id.hashtag,
      value: rawResult.count,
      percentage: rawResult.count / nbHashtags,
    })),
  };
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
  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults[0]?.count;
};

export const getUsernames = async (filters: SearchFilter, limit: number = 0) => {
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
    // because some users may not have looked up users, we take an arbitrary 30% more
    // to refilter them when returning, to make sure the number returned is exactly the limit chosen
    { $limit: limit * 1.3 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'username',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  const nbUsernames = await countUsernames(filters);

  return {
    count: nbUsernames,
    usernames: rawResults.slice(0, limit).map((rawResult: any) => ({
      id: rawResult._id,
      label: rawResult._id,
      value: rawResult.count,
      percentage: rawResult.count / nbUsernames,
      botScore: rawResult.user.botScore,
      verified: rawResult.user.verified,
      creationDate: rawResult.user.created,
      followersCount: rawResult.user.followersCount,
    })),
  };
};

export const getNbTweetsRepartition = async (filters: SearchFilter) => {
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
  ];


  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  const nbTweetsPerUserRepartition: any = rawResults.reduce(
    (repartition, { count }) => {
      if (count === 1) {
        repartition['1']++;
      } else if (count >= 2 && count <= 5) {
        repartition['2-5']++;
      } else if (count >= 6 && count <= 10) {
        repartition['6-10']++;
      } else if (count >= 11 && count <= 50) {
        repartition['11-50']++;
      } else if (count >= 50 && count <= 200) {
        repartition['50-200']++;
      } else if (count > 200) {
        repartition['200+']++;
      }
      return repartition;
    },
    {
      '1': 0,
      '2-5': 0,
      '6-10': 0,
      '11-50': 0,
      '50-200': 0,
      '200+': 0,
    }
  );

  return {
    repartition: nbTweetsPerUserRepartition,
    count: rawResults.length,
  };
};

export const getUsernamesValues = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    { $group: { _id: null, usernames: { $addToSet: '$username' } } },
    { $project: { _id: 0, usernames: true } },
  ];

  const [{ usernames }] = await TweetModel.aggregate<{ usernames: string[] }>(
    aggregation
  ).allowDiskUse(true);

  console.timeEnd(timer);

  return usernames;
};

// Get Photos
export const getPhotos = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: { ...match, 'media.type': 'photo' },
    },
    {
      $unwind: '$media',
    },
    {
      $match: { 'media.type': 'photo' },
    },
    {
      $group: {
        _id: '$media.fullUrl',
        detail: { $first: '$media' },
        count: { $sum: 1 },
      },
    },
    {
      $unwind: '$detail',
    },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults.map(({ detail: { _id, ...detail }, count }: any) => ({
    ...detail,
    count,
  }));
};

//Get videos
export const getVideos = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: { ...match, 'media.type': 'video' },
    },
    {
      $unwind: '$media',
    },
    {
      $match: { 'media.type': 'video' },
    },
    {
      $group: {
        _id: '$media.fullUrl',
        detail: { $first: '$media' },
        count: { $sum: 1 },
      },
    },
    {
      $unwind: '$detail',
    },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults.map(({ detail: { _id, ...detail }, count }: any) => ({
    ...detail,
    count,
  }));
};

//Get Outlinks
export const getOutlinks = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    {
      $unwind: '$outlinks',
    },
    {
      $group: {
        _id: '$outlinks',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults.map((rawResult: any) => ({
    url: rawResult._id,
    count: rawResult.count,
  }));
};

//Get TweetContents
export const getTweetContents = async (filters: SearchFilter) => {
  const { content, ...match }: any = getMatch(filters);
  const aggregation = [
    {
      $match: {
        content: content || {
          // $not: { $regex: '^RT .*$', $options: 'g' },
          $not: /^RT .*/,
        },
        ...match,
      },
    },
    {
      $group: {
        _id: {
          content: '$content',
          username: '$username',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.content',

        count: {
          $sum: 1,
        },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } },
  ];

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults.map((rawResult: any) => ({
    content: rawResult._id,
    count: rawResult.count,
  }));
};

export const countUsernames = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);
  const aggregation = [
    {
      $match: match,
    },
    {
      $project: {
        username: 1,
        hour: 1,
        searches: 1,
      },
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

  const rawResults: any[] = await TweetModel.aggregate(aggregation).allowDiskUse(true);

  return rawResults[0]?.count;
};

export const splitRequests = async ({ name, min, max, ...commonParams }: CommonGetFilters) => {
  try {
    const search = await get({ name });

    if (!search) {
      return null;
    }

    const match: any = getMatch({
      searchIds: [search._id],
      ...commonParams,
    });
    console.time('countTweets');
    // console.log(JSON.stringify(match, null, 2)); //eslint-disable-line

    const nbTweets = await TweetModel.count(match);
    console.timeEnd('countTweets');
    const batchNumber = 30000;
    const nbBatches = Math.ceil(nbTweets / batchNumber);

    let periods = [];
    let previousHour = null;
    if (nbTweets <= batchNumber) {
      periods = [
        {
          endDate: match?.hour?.$lte,
          startDate: match?.hour?.$gte,
          ...commonParams,
        },
      ];
    } else {
      for (let i = 1; i <= nbBatches; i++) {
        const lastRequest = i === nbBatches;

        const paginationMatch: any = previousHour
          ? { ...match, hour: { ...(match.hour || {}), $lte: new Date(previousHour) } }
          : match;

        const aggregation: any = lastRequest
          ? [{ $match: match }, { $sort: { hour: 1 } }, { $limit: 1 }]
          : [
              { $match: paginationMatch },
              { $sort: { hour: -1 } },
              { $skip: batchNumber },
              { $limit: 1 },
            ];

        try {
          console.time(`aggregateTweets ${i}`);
          // console.log(JSON.stringify(aggregation, null, 2)); //eslint-disable-line
          const [tweet] = await TweetModel.aggregate(aggregation).exec();
          console.timeEnd(`aggregateTweets ${i}`);

          if (!tweet) {
            break;
          }

          const { hour } = tweet;
          let period: any = { ...commonParams };
          if (i === 1) {
            period = { startDate: hour, endDate: match?.hour?.$lte };
          } else if (i === nbBatches) {
            period = { endDate: previousHour, startDate: match?.hour?.$gte };
          } else {
            period = { startDate: hour, endDate: previousHour };
          }

          periods.push(period);
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

export const getTweets = async (filters: SearchFilter) => {
  const match: any = getMatch(filters);

  const sortTweetsAggregation = (sort: any) => [
    {
      $match: match,
    },
    {
      $sort: sort,
    },
    {
      $limit: 3,
    },
  ];

  return {
    firstTweets: await TweetModel.aggregate(sortTweetsAggregation({ date: 1 })),
    mostRetweetedTweets: await TweetModel.aggregate(sortTweetsAggregation({ retweetCount: -1 })),
    mostLikedTweets: await TweetModel.aggregate(sortTweetsAggregation({ likeCount: -1 })),
    mostQuotedTweets: await TweetModel.aggregate(sortTweetsAggregation({ quoteCount: -1 })),
    mostCommentedTweets: await TweetModel.aggregate(sortTweetsAggregation({ replyCount: -1 })),
  };
};
