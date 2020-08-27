import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const createLeague = async (league: Omit<League, '_id'>) => {
  // const { name, positionSlots, scoringType, draftStatus, draftOrder } = league;
  try {
    const { data } = await axios.post(
      `${DEV_API_ROOT_URL}/admin/league`,
      league
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
