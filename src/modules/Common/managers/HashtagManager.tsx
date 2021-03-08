import HashtagModel from '../models/Hashtag';
import { Hashtag } from '../interfaces';

export const get = async (filter: { name: string }) => {
  try {
    const hashtag: Hashtag = await HashtagModel.findOne(filter).lean();

    return hashtag;
  } catch (e) {
    throw new Error('Could not find hashtag');
  }
};

export const list = async () => {
  try {
    const hashtags: Hashtag[] = await HashtagModel.find().lean();

    return hashtags;
  } catch (e) {
    throw new Error('Could not find hashtags');
  }
};
