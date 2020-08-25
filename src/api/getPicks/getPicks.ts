import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getPicks = async (leagueId: string) => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/api/picks/${leagueId}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
