import QueueItemModel from '../models/QueueItem';

export const createFirstFetch = async (search: string) => {
  try {
    const queueItem = new QueueItemModel({
      priority: 1,
      action: 'SEARCH',
      status: 'PENDING',
      search,
    });
    await queueItem.save();

    return queueItem;
  } catch (e) {
    console.error(e);
    throw new Error('Could not create queueItem');
  }
};
