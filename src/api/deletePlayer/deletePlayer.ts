import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const deletePlayer = async (playerId: string) => {
  try {
    const { data } = await axios.delete(
      `${DEV_API_ROOT_URL}/admin/player/${playerId}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
