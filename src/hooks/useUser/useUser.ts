import React from 'react';

export const useUser = (): UserContextInterface => {
  const [user, setUser] = React.useState<User>(null);

  const setCurrentUser = React.useCallback((currentUser: User): void => {
    setUser(currentUser);
  }, []);

  return { user, setCurrentUser };
};
