import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const updateLeague = async (league: League) => {
  const { name, scoringType, positionSlots, draftOrder, draftStatus } = league;
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/league/${league._id}`,
      {
        name,
        scoringType,
        positionSlots,
        draftOrder,
        draftStatus,
      },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
