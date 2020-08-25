import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getLeaguesList = async () => {
  try {
    const { data } = await axios.get(`${DEV_API_ROOT_URL}/api/leagues-list`);
    return data;
  } catch (err) {
    console.error(err);
  }
};
