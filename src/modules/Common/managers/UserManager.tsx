import * as scrapeApi from '../services/scrape-api';

import UserModel, { User } from '../models/User';

import dayjs from 'dayjs';
import pick from 'lodash/fp/pick';

const pickFields = [
  'id',
  'username',
  'displayname',
  'description',
  'verified',
  'created',
  'followersCount',
  'friendsCount',
  'statusesCount',
  'favouritesCount',
  'listedCount',
  'mediaCount',
  'location',
  'linkUrl',
  'profileImageUrl',
];

const platformId = 'twitter';

export const get = async (filter: { username: string }): Promise<Partial<User>> => {
  try {
    const { username } = filter;
    let user: User = await UserModel.findOne(filter);

    if (!user || (user && dayjs().isAfter(dayjs(user.updatedAt).add(10, 'days')))) {
      // scrape it
      const {
        data: { status, user: scrapedUser },
      } = await scrapeApi.getUser(username);

      if (status === 'active') {
        try {
          user = await UserModel.findOneAndUpdate(
            {
              id: scrapedUser.id,
              platformId,
            },
            {
              $set: { ...pick(pickFields)(scrapedUser), platformId },
            },
            {
              new: true,
              upsert: true,
            }
          );
        } catch (e) {
          console.error(e);
          return user;
        }
      }

      if (status === 'suspended') {
        return {
          _id: `${username}_suspended`,
          id: `${username}_suspended`,
          username,
          displayname: `Account suspended`,
          platformId,
        };
      }

      if (status === 'notfound') {
        return {
          _id: `${username}_notfound`,
          id: `${username}_notfound`,
          username,
          displayname: `Account Deleted`,
          platformId,
        };
      }
    }

    return user;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find user');
  }
};

export const batchUpsertFromScraping = async (users: any[], platformId: string) => {
  const bulkQueries = users.map((user) => {
    return {
      updateOne: {
        filter: { id: user.id, platformId },
        update: {
          ...pick(pickFields)(user),
          platformId,
        },
        upsert: true,
        raw: true,
      },
    };
  });

  try {
    return UserModel.bulkWrite(bulkQueries, {});
  } catch (e) {
    console.error(e);
    console.error(JSON.stringify(users, null, 2));
    throw e;
  }
};
