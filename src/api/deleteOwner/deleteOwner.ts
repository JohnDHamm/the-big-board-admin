import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const deleteOwner = async (ownerId: string) => {
  try {
    const { data } = await axios.delete(
      `${DEV_API_ROOT_URL}/admin/owner/${ownerId}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
