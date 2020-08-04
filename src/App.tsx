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

function App() {
  return (
    <Router>
      <Switch>
        <Route path={'/leagues'} component={LeaguesPage} />
        <Route path={'/owners'} component={OwnersPage} />
        <Route path={'/teams'} component={TeamsPage} />
        <Route path={'/players'} component={PlayersPage} />
        <Route path={'/'} component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
