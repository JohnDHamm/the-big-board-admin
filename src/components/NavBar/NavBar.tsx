import React from 'react';
import {
  Container,
  LogoContainer,
  Tab,
  TabsContainer,
  TabLink,
} from './NavBar.styles';
import Logo from '../Logo/Logo';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

const NavBar: React.FC = () => {
  const location = useLocation();
  const [path, setPath] = React.useState<string>('');

  React.useEffect(() => {
    if (location) {
      setPath(location.pathname);
    }
  }, [location]);

  return (
    <div>
      <Container>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <TabsContainer>
          <TabLink to={ROUTES.LEAGUES}>
            <Tab active={path === ROUTES.LEAGUES}>Leagues</Tab>
          </TabLink>
          <TabLink to={ROUTES.OWNERS}>
            <Tab active={path === ROUTES.OWNERS}>Owners</Tab>
          </TabLink>
          <TabLink to={ROUTES.TEAMS}>
            <Tab active={path === ROUTES.TEAMS}>Teams</Tab>
          </TabLink>
          <TabLink to={ROUTES.PLAYERS}>
            <Tab active={path === ROUTES.PLAYERS}>Players</Tab>
          </TabLink>
          <TabLink to={ROUTES.PICKS}>
            <Tab active={path === ROUTES.PICKS}>Picks</Tab>
          </TabLink>
          <TabLink to={ROUTES.RANKINGS}>
            <Tab active={path === ROUTES.RANKINGS}>Rankings</Tab>
          </TabLink>
        </TabsContainer>
      </Container>
    </div>
  );
};

export default NavBar;
