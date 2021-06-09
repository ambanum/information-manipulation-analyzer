import UserModel from '../models/User';

export const get = async (filter: { username: string }) => {
  try {
    const user: User = await UserModel.findOne(filter);

    if (!user) {
      // scrape it
    }

    return user;
  } catch (e) {
    throw new Error('Could not find user');
  }
};
