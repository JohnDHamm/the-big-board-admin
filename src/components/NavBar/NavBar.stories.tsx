import React from 'react';
import NavBar from './NavBar';
import { MemoryRouter } from 'react-router-dom';
// import { componentPathHelper } from '../../storybook';

export default {
  title: 'NavBar',
  decorators: [
    (getStory: () => React.ReactNode) => (
      <MemoryRouter initialEntries={['/']}>{getStory()}</MemoryRouter>
    ),
  ],
};

export const Default = () => (
  <div style={{ width: '100%', height: '400px', backgroundColor: 'lightgrey' }}>
    <NavBar />
  </div>
);
