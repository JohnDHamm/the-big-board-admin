import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getPositionRankings = async (scoringType: ScoringType) => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/api/position_rankings/${scoringType}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
