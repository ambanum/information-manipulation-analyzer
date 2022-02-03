/******************************************
 * Common
 ******************************************/

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
import { SearchVolumetry as ModelSearchVolumetry } from '../models/SearchVolumetry';
import { Tweet as ModelTweet } from '../models/Tweet';
import { User as ModelUser } from '../models/User';
import { OutlinksTableProps } from '../components/Datatables/OutlinksTable.d';
import { PhotosTableProps } from '../components/Datatables/PhotosTable.d';
import { PieChartProps } from '../components/Charts/PieChart.d';
import { UsernameTableProps } from '../components/Datatables/UsernameTable.d';
import { VideosTableProps } from '../components/Datatables/VideosTable.d';
import { TweetContentTableProps } from '../components/Datatables/TweetContentTable.d';

export interface CommonResponse {
  status: 'ok' | 'ko';
  message?: string;
}

export interface CommonGetFilters {
  name: string;
  min?: string;
  max?: string;
  lang?: string;
  username?: string;
  hashtag?: string;
  content?: string;
}

/******************************************
 * QueueItem
 ******************************************/

export type QueueItem = ModelQueueItem;
export type QueueItemStatuses = ModelQueueItemStatuses;
export type QueueItemActionTypes = ModelQueueItemActionTypes;

/******************************************
 * Tweet
 ******************************************/

export type Tweet = ModelTweet;

/******************************************
 * User
 ******************************************/
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

/******************************************
 * Search
 ******************************************/
export type Search = ModelSearch;
export type SearchTypes = ModelSearchTypes;
export type SearchStatus = ModelSearchStatus;
export interface GetSearchesResponse extends CommonResponse {
  searches: Search[];
}

export interface GetVolumetry {
  hour: Date;
  nbTweets: number;
  nbRetweets: number;
  nbLikes: number;
  nbQuotes: number;
  nbReplies: number;
}

export interface GetSearchResponse extends CommonResponse {
  search?: Search | null;
  nbTweets?: number;
  nbRetweets?: number;
  nbLikes?: number;
  nbQuotes?: number;
  nbReplies?: number;
  volumetry?: GetVolumetry[];
  nbUsernames?: number;
  nbAssociatedHashtags?: number;
}

export interface CreateSearchInput extends CommonResponse {
  name: string;
}

export interface CreateSearchResponse extends CommonResponse {
  search?: Search;
}

/******************************************
 * Languages
 ******************************************/
export interface GetSearchLanguagesResponse extends CommonResponse {
  languages?: PieChartProps['data'];
}
/******************************************
 * Hashtags
 ******************************************/
export interface GetSearchHashtagsResponse extends CommonResponse {
  hashtags?: HashtagTableProps['data'];
}
/******************************************
 * Usernames
 ******************************************/
export interface GetSearchUsernamesResponse extends CommonResponse {
  usernames?: UsernameTableProps['data'];
}

/******************************************
 * Tweets
 ******************************************/
export interface GetSearchTweetsResponse extends CommonResponse {
  firstTweets?: ModelTweet[];
  mostRetweetedTweets?: ModelTweet[];
  mostLikedTweets?: ModelTweet[];
  mostQuotedTweets?: ModelTweet[];
  mostCommentedTweets?: ModelTweet[];
}

/******************************************
 * SearchVolumetry
 ******************************************/
export type SearchVolumetry = ModelSearchVolumetry;

/******************************************
 * SplitRequests
 ******************************************/
export interface GetSearchSplitRequestsResponse extends CommonResponse {
  nbTweets?: number;
  search?: Search;
  filters?: {
    startDate: string;
    endDate: string;
    name: string;
  }[];
}

/******************************************
 * Videos
 ******************************************/
export interface GetSearchVideosResponse extends CommonResponse {
  videos?: VideosTableProps['data'];
}

/******************************************
 * Photos
 ******************************************/
export interface GetSearchPhotosResponse extends CommonResponse {
  photos?: PhotosTableProps['data'];
}

/******************************************
 * Outlinks
 ******************************************/
export interface GetSearchOutlinksResponse extends CommonResponse {
  outlinks?: OutlinksTableProps['data'];
}

export interface GetUserResponse extends CommonResponse {
  user: ModelUser;
}
