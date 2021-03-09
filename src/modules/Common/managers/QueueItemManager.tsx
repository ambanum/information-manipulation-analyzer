import QueueItemModel from '../models/QueueItem';
import { QueueItemActionTypes, QueueItemStatuses } from '../interfaces';

export const createFirstFetch = async (hashtagId: string) => {
  try {
    const queueItem = new QueueItemModel({
      priority: 2,
      action: QueueItemActionTypes.FIRST_FETCH,
      status: QueueItemStatuses.PENDING,
      hashtagId,
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