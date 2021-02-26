import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const getTeams = async () => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/API/teams`,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
