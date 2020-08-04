import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import {
  HomePage,
  LeaguesPage,
  OwnersPage,
  PlayersPage,
  TeamsPage,
} from './pages';
import { ROUTES } from './routes';
import { NavBar } from './components';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path={ROUTES.LEAGUES} component={LeaguesPage} />
        <Route path={ROUTES.OWNERS} component={OwnersPage} />
        <Route path={ROUTES.TEAMS} component={TeamsPage} />
        <Route path={ROUTES.PLAYERS} component={PlayersPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
