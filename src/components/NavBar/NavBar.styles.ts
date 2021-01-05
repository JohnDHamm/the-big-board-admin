import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { COLORS } from '../../styles';

export const Container = styled.div`
  height: 3rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.5rem;
  background-color: ${COLORS.BLACK};
  z-index: 10;
  overflow: hidden;
`;

export const LogoContainer = styled.div`
  width: 240px;
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-right: 2rem;
  padding-bottom: 0.5rem;
`;

export const TabLink = styled(Link)`
  text-decoration: none;
`;

export const Tab = styled.div<{ active: boolean }>`
  margin-left: 3rem;
  margin-bottom: -0.5rem;
  font-size: 1.25rem;
  color: ${(props) =>
    props.active ? COLORS.PRIMARY_GREEN : COLORS.DISABLED_GRAY};
  &:hover {
    color: ${(props) => (props.active ? COLORS.PRIMARY_GREEN : COLORS.WHITE)};
  }
`;

export const DisabledTab = styled(Tab)<{ active: boolean }>`
  &:hover {
    color: ${COLORS.DISABLED_GRAY};
  }
`;
