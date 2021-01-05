import React from 'react';

declare global {
  interface UserContextInterface {
    user: User;
    setCurrentUser: (user: User) => void;
  }
}

export const USER_DEFAULT_VALUE: UserContextInterface = {
  user: null,
  setCurrentUser: () => {},
};

export const UserContext = React.createContext<UserContextInterface>(
  USER_DEFAULT_VALUE
);
