import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const updateTeam = async (team: TeamUpdate) => {
  const { byeWeek, city, nickname } = team;
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/team/${team._id}`,
      {
        byeWeek,
        city,
        nickname,
      },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
