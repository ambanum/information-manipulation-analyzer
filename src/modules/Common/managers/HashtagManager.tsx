import * as LanguageManager from 'modules/Countries/managers/LanguageManager';
import * as QueueItemManager from './QueueItemManager';

import { Hashtag } from '../interfaces';
import HashtagModel from '../models/Hashtag';
import HashtagVolumetryModel from '../models/HashtagVolumetry';
import { VolumetryGraphProps } from '../components/Charts/VolumetryGraph.d';
import dayjs from 'dayjs';

const MIN_NB_OCCURENCES = 1;
const MIN_NB_RECORDS = 1000;

export const create = async ({ name }: { name: string }) => {
  try {
    const hashtag = new HashtagModel({ name, status: 'PENDING' });
    await hashtag.save();

    await QueueItemManager.createFirstFetch(hashtag._id);
    return hashtag;
  } catch (e) {
    console.error(e);
    throw new Error('Could not create hashtag');
  }
};

export const get = async (filter: { name: string }) => {
  try {
    const hashtag: Hashtag = await HashtagModel.findOne(filter)
      .populate({ path: 'volumetry', options: { sort: { date: 1 } } })
      .lean({ virtuals: true });

    return hashtag;
  } catch (e) {
    console.error(e);
    throw new Error(`Could not find hashtag ${filter.name}`);
  }
};

export const list = async ({ limit }: { limit: number } = { limit: 100 }) => {
  try {
    const hashtags: Hashtag[] = await HashtagModel.find().sort({ name: 1 }).limit(limit);

    return hashtags;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtags');
  }
};

export const listForPrerendering = async (
  { limit, maxVolumetry }: { limit: number; maxVolumetry: number } = {
    limit: 100,
    maxVolumetry: 10000,
  }
) => {
  try {
    const hashtags: Hashtag[] = await HashtagVolumetryModel.aggregate([
      {
        $group: {
          _id: '$hashtag',
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $lte: maxVolumetry } } },
      {
        $lookup: {
          from: 'hashtags',
          localField: '_id',
          foreignField: '_id',
          as: 'hashtag',
        },
      },
      { $unwind: '$hashtag' },
      { $project: { count: 1, name: '$hashtag.name' } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]).exec();
    return hashtags;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtags');
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
    const hashtag = await get({ name });

    const usernames: { [key: string]: number } = {};
    const languages: { [key: string]: number } = {};
    const associatedHashtags: { [key: string]: number } = {};
    let totalNbTweets: number = 0;
    let i = 0;
    const volumetryLength = hashtag.volumetry.length;

    const volumetry = hashtag.volumetry.reduce(
      (acc: VolumetryGraphProps['data'], volumetry) => {
        const newAcc = [...acc];

        const volumetryDate = volumetry.date;
        const volumetryDayJs = dayjs(volumetry.date);

        if (i > 0) {
          const volumetryDatePrevHour = volumetryDayJs.add(-1, 'hour').toDate();

          if (
            volumetryDatePrevHour.toISOString() !== hashtag.volumetry[i - 1]?.date.toISOString()
          ) {
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
          if (
            volumetryDateNextHour.toISOString() !== hashtag.volumetry[i + 1]?.date.toISOString()
          ) {
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
          Object.keys(volumetry.associatedHashtags || {}).forEach((associatedHashtag) => {
            associatedHashtags[associatedHashtag] =
              (associatedHashtags[associatedHashtag] || 0) +
              volumetry.associatedHashtags[associatedHashtag];
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
    delete hashtag.volumetry;

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
    const filteredAssociatedHashtags = associatedHashtagsKeys
      .filter(
        (associatedHashtag) =>
          nbAssociatedHashtags < MIN_NB_RECORDS ||
          associatedHashtags[associatedHashtag] > MIN_NB_OCCURENCES
      )
      .map((associatedHashtag) => ({
        id: associatedHashtag,
        label: associatedHashtag,
        value: associatedHashtags[associatedHashtag],
      }));

    const result = {
      hashtag: hashtag ? hashtag : null,
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
      associatedHashtags: filteredAssociatedHashtags,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtag in getWithData');
  }
};
