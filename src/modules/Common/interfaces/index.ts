/**
 * Common
 */

export interface CommonResponse {
  status: 'ok' | 'ko';
  message?: string;
}

/**
 * Hashtag
 */

export interface Hashtag {
  name: string;
  status: 'PENDING' | 'DONE';
  volumetry: HashtagVolumetry[];
}

export interface GetHashtagsResponse extends CommonResponse {
  hashtags: Hashtag[];
}

export interface CreateHashtagInput extends CommonResponse {
  name: string;
}

/**
 * QueueItem
 */

export enum QueueItemActionTypes {
  HASHTAG = 'HASHTAG',
}

export enum QueueItemStatuses {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  DONE_ERROR = 'DONE_ERROR',
}

export interface QueueItem {
  name: string;
  action: QueueItemActionTypes;
  status: QueueItemStatuses;
}

/**
 * HashtagVolumetry
 */

export interface HashtagVolumetry {
  date: string;
  nbTweets: number;
  nbRetweets: number;
  platformId: 'twitter';
}
