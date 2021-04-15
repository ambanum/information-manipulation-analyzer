import * as LanguageManager from 'modules/Countries/managers/LanguageManager';
import * as QueueItemManager from './QueueItemManager';

import { Hashtag } from '../interfaces';
import HashtagModel from '../models/Hashtag';
import { VolumetryGraphProps } from '../components/Charts/VolumetryGraph.d';

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

export const list = async () => {
  try {
    const hashtags: Hashtag[] = await HashtagModel.find().sort({ name: 1 });

    return hashtags;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtags');
  }
};

export const getWithData = async (filter: { name: string }) => {
  try {
    const hashtag = await get(filter);

    const usernames: { [key: string]: number } = {};
    const languages: { [key: string]: number } = {};
    const associatedHashtags: { [key: string]: number } = {};
    let totalNbTweets: number = 0;

    const volumetry = hashtag.volumetry.reduce(
      (acc: VolumetryGraphProps['data'], volumetry) => {
        const newAcc = [...acc];
        newAcc[0].data.push({ x: volumetry.date, y: volumetry.nbTweets || 0 });
        newAcc[1].data.push({ x: volumetry.date, y: volumetry.nbRetweets || 0 });
        newAcc[2].data.push({ x: volumetry.date, y: volumetry.nbLikes || 0 });
        newAcc[3].data.push({ x: volumetry.date, y: volumetry.nbQuotes || 0 });

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

    const result = {
      hashtag: hashtag ? hashtag : null,
      volumetry,
      totalNbTweets,
      usernames: Object.keys(usernames).map((username) => ({
        id: username,
        label: username,
        value: usernames[username],
      })),
      languages: Object.keys(languages).map((language) => ({
        id: language,
        label: LanguageManager.getName(language),
        value: languages[language],
      })),
      associatedHashtags: Object.keys(associatedHashtags).map((associatedHashtag) => ({
        id: associatedHashtag,
        label: associatedHashtag,
        value: associatedHashtags[associatedHashtag],
      })),
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtag in getWithData');
  }
};
