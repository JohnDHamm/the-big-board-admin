import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const getOverallRankings = async (scoringType: ScoringType) => {
  try {
    const { data } = await axios.get(
      `${DEV_API_ROOT_URL}/api/overall_rankings/${scoringType}`
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
