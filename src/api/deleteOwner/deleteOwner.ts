import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const deleteOwner = async (ownerId: string) => {
  try {
    const { data } = await axios.delete(
      `${DEV_API_ROOT_URL}/admin/owner/${ownerId}`,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
