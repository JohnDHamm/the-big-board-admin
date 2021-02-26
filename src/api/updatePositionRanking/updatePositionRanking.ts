import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const updatePositionRanking = async (positionRank: SavedRanking) => {
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/position_ranking/${positionRank._id}`,
      { playerId: positionRank.playerId },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
