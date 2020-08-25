import React from 'react';
import { ButtonBlock, Container, Title } from './RankPlayerSelectModal.styles';
import { Autocomplete } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';

interface Props {
  onCancel: () => void;
  onSelect: (player: DisplayPlayer) => void;
  playersForSelect: DisplayPlayer[];
  rankInfo: {
    rankNumber: number;
    position: NFL_Position;
    scoringType: ScoringType;
  };
  visible: boolean;
}
const RankPlayerSelectModal: React.FC<Props> = ({
  onCancel,
  onSelect,
  playersForSelect,
  rankInfo,
  visible,
}) => {
  const [
    selectedPlayer,
    setSelectedPlayer,
  ] = React.useState<DisplayPlayer | null>(null);

  const handlePlayerChange = (
    event: React.ChangeEvent<{}>,
    value: DisplayPlayer | null
  ) => {
    if (value) {
      // setSelectedPlayer(value);
      onSelect(value);
    }
  };

  const getPlayerLabel = (player: DisplayPlayer) => {
    return `${player.firstName} ${player.lastName} - ${player.position} | ${player.teamAbbv}`;
  };

  return visible ? (
    <Container>
      <Title>
        {rankInfo.scoringType} {rankInfo.position} #{rankInfo.rankNumber}
      </Title>
      <Autocomplete
        id="players-select"
        options={playersForSelect}
        getOptionLabel={(option) => getPlayerLabel(option)}
        style={{ width: 400 }}
        value={selectedPlayer}
        onChange={handlePlayerChange}
        renderInput={(params) => (
          <TextField {...params} label="select player" variant="outlined" />
        )}
      />
      <ButtonBlock>
        <Button onClick={onCancel} variant="contained" color="primary">
          cancel
        </Button>
      </ButtonBlock>
    </Container>
  ) : null;
};

export default RankPlayerSelectModal;
