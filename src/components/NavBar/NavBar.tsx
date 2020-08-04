import React from 'react';
import {
  Container,
  LogoContainer,
  LogoLink,
  Tab,
  TabsContainer,
  TabLink,
  TextLogo,
} from './NavBar.styles';
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
          <LogoLink to={ROUTES.HOME}>
            <TextLogo active={path === ROUTES.HOME}>Big Board Admin</TextLogo>
          </LogoLink>
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
        </TabsContainer>
      </Container>
    </div>
  );
};

export default NavBar;
