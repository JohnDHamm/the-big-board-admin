import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const getPicks = async (leagueId: string) => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/api/picks/${leagueId}`,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
