import React from 'react';
import {
  Content,
  ContentItem,
  PositionBlock,
  RadioBlock,
} from './PlayersPage.styles';
import { PageLayout } from '../../layout';
import {
  deletePlayer,
  getPlayers,
  getTeams,
  savePlayer,
  updatePlayer,
} from '../../api';
import { Autocomplete } from '@material-ui/lab';
import { Button, Radio, Snackbar, TextField } from '@material-ui/core';
import sortBy from 'lodash.sortby';

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = React.useState<SavedPlayer[]>([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [
    selectedPlayer,
    setSelectedPlayer,
  ] = React.useState<SavedPlayer | null>(null);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [openSnack, setOpenSnack] = React.useState<boolean>(false);
  const [snackMessage, setSnackMessage] = React.useState<string>('');

  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [position, setPosition] = React.useState<NFL_Position>('QB');

  const initPage = () => {
    getPlayers()
      .then((playersList: SavedPlayer[]) => {
        setPlayers(sortBy(playersList, ['lastName', 'firstName']));
      })
      .then(() => getTeams())
      .then((teamsList: Team[]) => {
        setTeams(sortBy(teamsList, ['city', 'nickname']));
      })
      .catch((err) => console.log('err', err));
  };

  const getPlayerLabel = (player: SavedPlayer): string => {
    const team = teams.filter((team) => team._id === player.teamId);
    return `${player.firstName} ${player.lastName} - ${player.position} | ${team[0].abbv}`;
  };

  const handlePlayerChange = (
    event: React.ChangeEvent<{}>,
    value: SavedPlayer | null
  ) => {
    if (value) {
      setSelectedPlayer(value);
      setFirstName(value.firstName);
      setLastName(value.lastName);
      setPosition(value.position);
      const team: Team[] = teams.filter((team) => team._id === value?.teamId);
      setSelectedTeam(team[0]);
      setIsEditing(true);
      setShowForm(true);
    } else {
      setIsEditing(false);
      setShowForm(false);
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setPosition('QB');
    setSelectedTeam(null);
    setSelectedPlayer(null);
  };

  const initNewPlayer = () => {
    clearForm();
    setShowForm(true);
  };

  const handleTeamChange = (
    event: React.ChangeEvent<{}>,
    value: NFL_Team | null
  ) => {
    setSelectedTeam(value);
  };

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value as NFL_Position);
  };

  const validateNames = (): boolean => {
    return firstName.length > 0 && lastName.length > 0;
  };

  const submitUpdate = () => {
    if (selectedPlayer && selectedTeam && validateNames()) {
      const update: SavedPlayer = {
        _id: selectedPlayer._id,
        firstName,
        lastName,
        position,
        teamId: selectedTeam?._id,
      };
      updatePlayer(update)
        .then((res) => {
          const newList = players.filter((player) => player._id !== res._id);
          newList.push(res);
          setPlayers(sortBy(newList, ['lastName', 'firstName']));
          setSnackMessage('Player updated!');
          setOpenSnack(true);
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      //TODO: show error for missing info
      console.warn('missing form fields');
    }
  };

  const cancelUpdate = () => {
    setSelectedPlayer(null);
    clearForm();
    setIsEditing(false);
    setShowForm(false);
  };

  const submitDelete = () => {
    if (selectedPlayer) {
      deletePlayer(selectedPlayer?._id)
        .then((res: SavedPlayer) => {
          const newList = players.filter((player) => player._id !== res._id);
          setPlayers(sortBy(newList, ['lastName', 'firstName']));
          setSnackMessage('Player removed!');
          setOpenSnack(true);
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    }
  };

  const submitNew = () => {
    if (selectedTeam && validateNames()) {
      const update: Player = {
        firstName,
        lastName,
        position,
        teamId: selectedTeam?._id,
      };
      savePlayer(update)
        .then((res) => {
          const updatePlayers = Array.from(players);
          updatePlayers.push(res);
          setPlayers(sortBy(updatePlayers, ['lastName', 'firstName']));
          setSnackMessage('New player added!');
          setOpenSnack(true);
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      //TODO: show error for missing info
      console.warn('missing form fields');
    }
  };

  const renderPositions = () => {
    const positions: NFL_Position[] = ['QB', 'RB', 'WR', 'TE', 'D', 'K'];
    return positions.map((pos) => {
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

  const handleSnackClose = (event: React.SyntheticEvent, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  React.useEffect(() => {
    initPage();
  }, []);

  return (
    <PageLayout>
      {!showForm && (
        <Content>
          <ContentItem>
            <Autocomplete
              id="players-select"
              options={players}
              getOptionLabel={(option) => getPlayerLabel(option)}
              style={{ width: 400 }}
              value={selectedPlayer}
              onChange={handlePlayerChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="select player"
                  variant="outlined"
                />
              )}
            />
          </ContentItem>
          <ContentItem>
            <Button onClick={initNewPlayer} variant="contained" color="primary">
              add player
            </Button>
          </ContentItem>
        </Content>
      )}
      {showForm && (
        <Content>
          <ContentItem>
            <TextField
              label="FIRST NAME"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: 400 }}
            />
          </ContentItem>
          <ContentItem>
            <TextField
              label="LAST NAME"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: 400 }}
            />
          </ContentItem>
          <PositionBlock>{renderPositions()}</PositionBlock>
          <ContentItem>
            <Autocomplete
              id="teams-select"
              options={teams}
              getOptionLabel={(option) => `${option.city} ${option.nickname}`}
              style={{ width: 400 }}
              value={selectedTeam}
              onChange={handleTeamChange}
              renderInput={(params) => (
                <TextField {...params} label="TEAM" variant="outlined" />
              )}
            />
          </ContentItem>
          {isEditing ? (
            <>
              <ContentItem>
                <Button
                  onClick={submitUpdate}
                  variant="contained"
                  color="primary"
                >
                  save changes
                </Button>
              </ContentItem>
              <ContentItem>
                <Button
                  onClick={cancelUpdate}
                  variant="outlined"
                  color="primary"
                >
                  cancel
                </Button>
              </ContentItem>
              <ContentItem>
                <Button
                  onClick={submitDelete}
                  variant="contained"
                  color="secondary"
                >
                  delete player
                </Button>
              </ContentItem>
            </>
          ) : (
            <>
              <ContentItem>
                <Button onClick={submitNew} variant="contained" color="primary">
                  save player
                </Button>
              </ContentItem>
              <ContentItem>
                <Button
                  onClick={cancelUpdate}
                  variant="outlined"
                  color="primary"
                >
                  cancel
                </Button>
              </ContentItem>
            </>
          )}
        </Content>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
    </PageLayout>
  );
};

export default PlayersPage;
