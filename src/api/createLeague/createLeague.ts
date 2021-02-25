import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const createLeague = async (league: Omit<League, '_id'>) => {
  try {
    const { data } = await axios.post(
      `${DEV_API_ROOT_URL}/admin/league`,
      league,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
