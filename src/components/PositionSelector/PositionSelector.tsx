import React from 'react';
import { PositionBlock, RadioBlock } from './PositionSelector.styles';
import { Radio } from '@material-ui/core';
import { NFL_POSITIONS } from '../../constants';

interface Props {
  onPositionChange: (newPosition: NFL_Position) => void;
  initialPosition: NFL_Position;
}

const PositionSelector: React.FC<Props> = ({
  initialPosition,
  onPositionChange,
}) => {
  const [position, setPosition] = React.useState<NFL_Position>(initialPosition);

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = event.target.value as NFL_Position;
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const renderPositions = () => {
    return NFL_POSITIONS.map((pos) => {
      return (
        <RadioBlock key={pos}>
          <Radio
            checked={position === pos}
            onChange={handlePositionChange}
            value={pos}
            name="position-radio"
            color="primary"
          />
          <p>{pos}</p>
        </RadioBlock>
      );
    });
  };

  return <PositionBlock>{renderPositions()}</PositionBlock>;
};

export default PositionSelector;
