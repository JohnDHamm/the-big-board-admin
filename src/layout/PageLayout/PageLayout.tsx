import React from 'react';
import { StyledPage } from './PageLayout.styles';

const PageLayout: React.FC = ({ children }) => {
  return <StyledPage>{children}</StyledPage>;
};

export default PageLayout;
