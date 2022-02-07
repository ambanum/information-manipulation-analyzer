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
  status: 'ok' | 'ko';
  search: GraphSearch;
  error?: string;
  message?: string;
}

export interface GraphsSearchResponse {
  status: 'ok' | 'ko';
  searches: GraphSearch[];
  error?: string;
  message?: string;
}

export const get = async (search: string) => {
  const { data } = await axios.get<GraphSearchResponse>(
    `${GRAPH_API_URL}/graph-search/${encodeURIComponent(search)}`,
    { timeout: 5000 }
  );
  return data;
};

export const create = async (search: string) => {
  const { data } = await axios.post<GraphSearchResponse>(
    `${GRAPH_API_URL}/graph-search/${encodeURIComponent(search)}`,
    { timeout: 5000 }
  );
  return data;
};

export const list = async () => {
  const { data } = await axios.get<GraphsSearchResponse>(`${GRAPH_API_URL}/graph-searches`);
  return data;
};
