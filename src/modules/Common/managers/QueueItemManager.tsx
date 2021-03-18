import { QueueItemActionTypes, QueueItemStatuses } from '../interfaces';

import QueueItemModel from '../models/QueueItem';

export const createFirstFetch = async (hashtag: string) => {
  try {
    const queueItem = new QueueItemModel({
      priority: 1,
      action: QueueItemActionTypes.HASHTAG,
      status: QueueItemStatuses.PENDING,
      hashtag,
    });
    await queueItem.save();

    return queueItem;
  } catch (e) {
    console.error(e);
    throw new Error('Could not create queueItem');
  }
};

// export const get = async (filter: { name: string }) => {
//   try {
//     const queueItem: QueueItem = await QueueItemModel.findOne(filter);
//
//     return queueItem;
//   } catch (e) {
//     throw new Error('Could not find queueItem');
//   }
// };
//
// export const list = async () => {
//   try {
//     const queueItems: QueueItem[] = await QueueItemModel.find();
//
//     return queueItems;
//   } catch (e) {
//     throw new Error('Could not find queueItems');
//   }
// };
