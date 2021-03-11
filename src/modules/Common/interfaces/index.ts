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
  _id: string;
  name: string;
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'DONE_FIRST_FETCH'
    | 'PROCESSING_PREVIOUS'
    | 'DONE'
    | 'DONE_ERROR';
  volumetry: HashtagVolumetry[];
}

export interface GetHashtagsResponse extends CommonResponse {
  hashtags: Hashtag[];
}

export interface GetHashtagResponse extends CommonResponse {
  hashtag: Hashtag;
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
  nbLikes: number;
  nbQuotes: number;
  platformId: 'twitter';
}
