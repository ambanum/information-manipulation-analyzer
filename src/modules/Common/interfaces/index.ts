/**
 * Common
 */

import {
  QueueItem as ModelQueueItem,
  QueueItemActionTypes as ModelQueueItemActionTypes,
  QueueItemStatuses as ModelQueueItemStatuses,
} from '../models/QueueItem';
import {
  Search as ModelSearch,
  SearchStatus as ModelSearchStatus,
  SearchTypes as ModelSearchTypes,
} from '../models/Search';

import { HashtagTableProps } from '../components/Datatables/HashtagTable.d';
import { LanguageGraphProps } from '../components/Charts/LanguageGraph.d';
import { SearchVolumetry as ModelSearchVolumetry } from '../models/SearchVolumetry';
import { User as ModelUser } from '../models/User';
import { UsernameTableProps } from '../components/Datatables/UsernameTable.d';
import { VolumetryGraphProps } from '../components/Charts/VolumetryGraph.d';

export interface CommonResponse {
  status: 'ok' | 'ko';
  message?: string;
}

/**
 * QueueItem
 */

export type QueueItem = ModelQueueItem;
export type QueueItemStatuses = ModelQueueItemStatuses;
export type QueueItemActionTypes = ModelQueueItemActionTypes;

/**
 * User
 */
export interface GetUserResponse extends CommonResponse {
  user: ModelUser;
}

export interface GetUserBotScoreResponse extends CommonResponse {
  score?: number;
  username?: string;
  metadata?: any;
  updatedAt?: string | Date;
  provider?: string;
}

/**
 * Search
 */
export type Search = ModelSearch;
export type SearchTypes = ModelSearchTypes;
export type SearchStatus = ModelSearchStatus;
export interface GetSearchesResponse extends CommonResponse {
  searches: Search[];
}

export interface GetSearchResponse extends CommonResponse {
  search: Omit<Search, 'volumetry'>;
  totalNbTweets: number;
  volumetry: VolumetryGraphProps['data'];
  languages: LanguageGraphProps['data'];
  nbUsernames: number;
  usernames: UsernameTableProps['data'];
  nbAssociatedHashtags: number;
  associatedHashtags: HashtagTableProps['data'];
}

export interface CreateSearchInput extends CommonResponse {
  name: string;
}

export interface CreateSearchResponse extends CommonResponse {
  search?: Search;
}

/**
 * SearchVolumetry
 */
export type SearchVolumetry = ModelSearchVolumetry;
