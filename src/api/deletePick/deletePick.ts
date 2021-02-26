import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const deletePick = async (pickId: string) => {
  try {
    const { data } = await axios.delete(
      `${DEV_API_ROOT_URL}/admin/pick/${pickId}`,
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
