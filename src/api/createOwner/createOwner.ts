import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const createOwner = async (owner: NewOwner) => {
  try {
    const { data } = await axios.post(`${DEV_API_ROOT_URL}/admin/owner`, owner);
    return data;
  } catch (err) {
    console.error(err);
  }
};
