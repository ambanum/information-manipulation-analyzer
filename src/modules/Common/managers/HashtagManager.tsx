import * as QueueItemManager from './QueueItemManager';
import HashtagModel from '../models/Hashtag';
import { Hashtag } from '../interfaces';

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
    throw new Error('Could not find hashtag');
  }
};

export const list = async () => {
  try {
    const hashtags: Hashtag[] = await HashtagModel.find();

    return hashtags;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find hashtags');
  }
};
