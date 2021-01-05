const PROTECTED_ROUTE = '/admin';

export const ROUTES = {
  HOME: '/',
  ADMIN: PROTECTED_ROUTE,
  LEAGUES: `${PROTECTED_ROUTE}/leagues`,
  OWNERS: `${PROTECTED_ROUTE}/owners`,
  TEAMS: `${PROTECTED_ROUTE}/teams`,
  PICKS: `${PROTECTED_ROUTE}/picks`,
  PLAYERS: `${PROTECTED_ROUTE}/players`,
  RANKINGS: `${PROTECTED_ROUTE}/rankings`,
};
