import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const savePlayer = async (player: Player) => {
  const { firstName, lastName, position, teamId } = player;
  try {
    const { data } = await axios.post(
      `${DEV_API_ROOT_URL}/admin/player`,
      {
        firstName,
        lastName,
        position,
        teamId,
      },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
