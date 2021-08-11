import * as scrapeApi from '../services/scrape-api';

import UserModel, { User, UserBotScore } from '../models/User';

import dayjs from 'dayjs';
import pick from 'lodash/fp/pick';

const snscrapePickFields = [
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

const botScorePickFields = [
  'botScore',
  'botScoreProvider',
  'botScoreUpdatedAt',
  'botScoreMetadata',
];

const platformId = 'twitter';

export const retrieveAndUpdateUser = async (
  username: string
): Promise<Partial<User> | undefined> => {
  const {
    data: { status, user: scrapedUser },
  } = await scrapeApi.getUser(username);

  if (status === 'active') {
    try {
      const user = await UserModel.findOneAndUpdate(
        {
          id: scrapedUser.id,
          platformId,
        },
        {
          $set: { ...pick(snscrapePickFields)(scrapedUser), platformId },
        },
        {
          new: true,
          upsert: true,
        }
      );
      return user;
    } catch (e) {
      console.error(e);
      return undefined;
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
};

export const get = async (filter: { username: string }): Promise<Partial<User>> => {
  try {
    const { username } = filter;
    let user: Partial<User> = await UserModel.findOne(filter);

    if (!user || (user && dayjs().isAfter(dayjs(user.updatedAt).add(10, 'days')))) {
      // scrape it
      user = (await retrieveAndUpdateUser(username)) || user;
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
          ...pick(snscrapePickFields)(user),
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

export const getBotScore = async (filter: { username: string }): Promise<UserBotScore> => {
  try {
    const { username } = filter;

    let user: Partial<User> = await get(filter);

    const isNotSuspendedNorDeleted = !!user.updatedAt;

    if (user && isNotSuspendedNorDeleted) {
      if (
        !user.botScoreUpdatedAt ||
        dayjs().isAfter(dayjs(user.botScoreUpdatedAt).add(10, 'days'))
      ) {
        const { data } = await scrapeApi.getUserBotScore(username);

        try {
          user = await UserModel.findOneAndUpdate(
            {
              id: user.id,
              platformId,
            },
            {
              $set: data,
            },
            {
              new: true,
              upsert: false,
            }
          );
          return data;
        } catch (e) {
          console.error(e);
        }
      }
    }

    return pick(botScorePickFields)(user);
  } catch (e) {
    console.error(e);
    throw new Error('Could not find user');
  }
};

export const list = async ({ limit }: { limit: number } = { limit: 10000 }) => {
  try {
    const users: User[] = await UserModel.find().sort({ username: 1 }).limit(limit);
    return users;
  } catch (e) {
    console.error(e);
    throw new Error('Could not find users');
  }
};
