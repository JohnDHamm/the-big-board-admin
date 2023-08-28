import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';
import {
  HomePage,
  LeaguesPage,
  OwnersPage,
  PicksPage,
  PlayersPage,
  RankingsPage,
  TeamsPage,
} from './pages';
import { ROUTES } from './routes';
import { NavBar } from './components';
import { UserContext } from './contexts/UserContext';
import { useUser } from './hooks/useUser/useUser';

const ProtectedRoutes: React.FC = () => {
  const { user } = React.useContext(UserContext);

  return user ? (
    <div>
      <NavBar />
      <Switch>
        <Route path={ROUTES.LEAGUES} component={LeaguesPage} />
        <Route path={ROUTES.OWNERS} component={OwnersPage} />
        <Route path={ROUTES.TEAMS} component={TeamsPage} />
        <Route path={ROUTES.PLAYERS} component={PlayersPage} />
        <Route path={ROUTES.PICKS} component={PicksPage} />
        <Route path={ROUTES.RANKINGS} component={RankingsPage} />
      </Switch>
    </div>
  ) : (
    <Redirect to={ROUTES.HOME} />
  );
};

function App() {
  const user = useUser();
  // document.addEventListener('visibilitychange', () => {
  //   console.log('document.visibilityState', document.visibilityState);
  //   // console.log('user', user);
  // });

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Switch>
          <Route path={ROUTES.ADMIN} component={ProtectedRoutes} />
          <Route path={ROUTES.HOME} component={HomePage} />
        </Switch>
        <Redirect to={ROUTES.HOME} />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
