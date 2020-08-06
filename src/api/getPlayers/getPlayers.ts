import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getPlayers = async () => {
  try {
    const { data } = await axios.get(`${DEV_API_ROOT_URL}/API/players`);
    return data;
  } catch (err) {
    console.error(err);
  }
};
