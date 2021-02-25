import { LOCAL_STORAGE } from '../../constants';

export const createAuthenticationHeaders = () => {
  const token = localStorage.getItem(LOCAL_STORAGE.JWT_TOKEN);
  return { headers: { Authorization: `Bearer ${token}` } };
};
