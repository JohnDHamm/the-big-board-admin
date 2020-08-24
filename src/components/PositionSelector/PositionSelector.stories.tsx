import React from 'react';
import PositionSelector from './PositionSelector';

export default {
  title: 'PositionSelector',
  component: PositionSelector,
};

export const Default = () => (
  <PositionSelector
    initialPosition="QB"
    onPositionChange={(pos: NFL_Position) => console.log('new position', pos)}
  />
);
