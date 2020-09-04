import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getAllOwners = async () => {
  try {
    const { data } = await axios.get(`${DEV_API_ROOT_URL}/admin/all_owners`);
    return data;
  } catch (err) {
    console.error(err);
  }
};
