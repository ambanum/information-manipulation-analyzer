import axios from 'axios';
const GRAPH_API_URL = process.env.GRAPH_API_URL || 'http://localhost:4001';

export enum GraphSearchStatuses {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  DONE_ERROR = 'DONE_ERROR',
}

export enum GraphSearchTypes {
  KEYWORD = 'KEYWORD',
  HASHTAG = 'HASHTAG',
  MENTION = 'MENTION',
  URL = 'URL',
  CASHTAG = 'CASHTAG',
}

export interface GraphSearch extends Document {
  name: string;
  status: GraphSearchStatuses;
  type: GraphSearchTypes;
  result: {
    nodes: any[];
    edges: any[];
    metadata: any;
  };
  metadata?: {
    [key: string]: any;
    url: any;
  };
  error?: string;
}

export interface GraphSearchResponse {
  search: GraphSearch;
}

export interface GraphsSearchResponse {
  searches: GraphSearch[];
}

export const get = async (search: string) => {
  return axios.get<GraphSearchResponse>(`${GRAPH_API_URL}/graph-search/${search}`);
};
export const list = async () => {
  return axios.get<GraphsSearchResponse>(`${GRAPH_API_URL}/graph-search`);
};
