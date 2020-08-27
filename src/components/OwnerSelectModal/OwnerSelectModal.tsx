import React from 'react';
import { ButtonBlock, Container, Title } from './OwnerSelectModal.styles';
import { Autocomplete } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';

interface Props {
  onCancel: () => void;
  onSelect: (owner: Owner) => void;
  ownersForSelect: Owner[];
  title: string;
  visible: boolean;
}
const OwnerSelectModal: React.FC<Props> = ({
  onCancel,
  onSelect,
  ownersForSelect,
  title,
  visible,
}) => {
  const [selectedOwner] = React.useState<Owner | null>(null);

  const handleOwnerChange = (
    event: React.ChangeEvent<{}>,
    value: Owner | null
  ) => {
    if (value) {
      onSelect(value);
    }
  };

  return visible ? (
    <Container>
      <Title>{title}</Title>
      <Autocomplete
        id="owners-select"
        options={ownersForSelect}
        getOptionLabel={(option) => option.name}
        style={{ width: 400 }}
        value={selectedOwner}
        onChange={handleOwnerChange}
        renderInput={(params) => (
          <TextField {...params} label="select owner" variant="outlined" />
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

export default OwnerSelectModal;
