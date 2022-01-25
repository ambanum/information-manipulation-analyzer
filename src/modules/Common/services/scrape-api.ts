import axios from 'axios';
const PROCESSOR_API_URL = process.env.PROCESSOR_API_URL || 'http://localhost:4000';

export interface UserBotScoreResponse {
  botScore?: number;
  botScoreProvider?: string;
  botScoreUpdatedAt?: Date | string;
  botScoreMetadata?: any;
}

export interface SearchGraphResponse {
  graphUrl?: string;
  graphProvider?: string;
  graphUpdatedAt?: string;
  graphMetadata?: any;
}

export const getUser = async (username: string) => {
  return axios.get<{ status: 'active' | 'suspended' | 'notfound'; user?: any }>(
    `${PROCESSOR_API_URL}/scrape/twitter/user/${username}`
  );
};

export const getUserBotScore = async (username: string) => {
  return axios.get<UserBotScoreResponse>(
    `${PROCESSOR_API_URL}/scrape/twitter/user/${username}/botscore`
  );
};

export const getGraph = async (search: string) => {
  console.log(`${PROCESSOR_API_URL}/graph/twitter/search/${search}`);

  return axios.get<SearchGraphResponse>(`${PROCESSOR_API_URL}/graph/twitter/search/${search}`);
};
