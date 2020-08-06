import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

export const updatePlayer = async (player: SavedPlayer) => {
  const { firstName, lastName, position, teamId } = player;
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/player/${player._id}`,
      {
        firstName,
        lastName,
        position,
        teamId,
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
