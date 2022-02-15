import type { GraphSearch } from '../services/graph-api';

/******************************************
 * Common
 ******************************************/

export interface CommonResponse {
  status: 'ok' | 'ko';
  message?: string;
}

export interface CommonError {
  status: 'ok' | 'ko';
  error?: string;
  message?: string;
}

/******************************************
 * graph
 ******************************************/

export type GraphSearchResponse =
  | {
      status: 'ok';
      searchGraph: GraphSearch;
      message?: string;
    }
  | (CommonError & { searchGraph?: undefined });

export type GraphsSearchResponse =
  | {
      status: 'ok';
      searchGraphs: GraphSearch[];
      message?: string;
    }
  | CommonError;

export type CreateSearchResponse =
  | {
      status: 'ok';
      searchGraph: GraphSearch;
      message?: string;
    }
  | CommonError;
