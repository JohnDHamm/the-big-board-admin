import axios from 'axios';
import { DEV_API_ROOT_URL } from '../index';

declare global {
  interface LoginResponse {
    data: User;
  }
}

export const adminLogin = async (admin: Admin) => {
  try {
    const { data }: LoginResponse = await axios.post(
      `${DEV_API_ROOT_URL}/admin/login`,
      admin
    );
    return data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
