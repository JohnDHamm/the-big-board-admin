import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';
import { createAuthenticationHeaders } from '../helpers';

export const updateOwner = async (owner: Owner & Password) => {
  const { name, isCommish, password } = owner;
  try {
    const { data } = await axios.patch(
      `${DEV_API_ROOT_URL}/admin/owner/${owner._id}`,
      {
        name,
        isCommish,
        password,
      },
      createAuthenticationHeaders()
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
