import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const updateOverallRanking = async (
  overallRank: SavedOverallRanking
) => {
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/overall_ranking/${overallRank._id}`,
      { playerId: overallRank.playerId },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
