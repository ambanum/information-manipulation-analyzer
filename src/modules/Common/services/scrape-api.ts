import axios from 'axios';
const PROCESSOR_API_URL = process.env.PROCESSOR_API_URL || 'http://localhost:4000';

export const getUser = async (username: string) => {
  return axios.get<{ status: 'active' | 'suspended' | 'notfound'; user?: any }>(
    `${PROCESSOR_API_URL}/scrape/twitter/user/${username}`
  );
};
