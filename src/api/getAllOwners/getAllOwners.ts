import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const getAllOwners = async () => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/admin/all_owners`,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
