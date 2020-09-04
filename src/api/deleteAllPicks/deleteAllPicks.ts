import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const deleteAllPicks = async (leagueId: string) => {
  try {
    const { data } = await axios.delete(
      `${DEV_API_ROOT_URL}/admin/remove_picks/${leagueId}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
