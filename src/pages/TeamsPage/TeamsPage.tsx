import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Content, ContentItem, PageLayout } from '../../layout';
import { getTeams, updateTeam } from '../../api';
import { Button, Snackbar, TextField } from '@material-ui/core';
import sortBy from 'lodash.sortby';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [city, setCity] = React.useState<string | null>('');
  const [nickname, setNickname] = React.useState<string | null>('');
  const [byeWeek, setByeWeek] = React.useState<string | null>('');
  const [snackMessage, setSnackMessage] = React.useState<string>('');
  const [openSnack, setOpenSnack] = React.useState<boolean>(false);

  const initPage = async () => {
    const teamsList: Team[] = await getTeams();
    setTeams(sortBy(teamsList, ['city']));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    value: NFL_Team | null
  ) => {
    setSelectedTeam(value);
    if (value) {
      setCity(value.city);
      setNickname(value.nickname);
      setByeWeek(value.byeWeek.toString());
    }
  };

  const saveChanges = () => {
    if (selectedTeam && city && nickname && byeWeek) {
      updateTeam({
        _id: selectedTeam._id,
        byeWeek: Number(byeWeek),
        city,
        nickname,
      })
        .then((res) => {
          setSnackMessage('Team updated!');
          setOpenSnack(true);
        })
        .catch((err) => console.log('err', err));
    } else {
      console.error("something wrong - can't update");
    }
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
      <div>teams page</div>
      <Autocomplete
        id="teams-select"
        options={teams}
        getOptionLabel={(option) => `${option.city} ${option.nickname}`}
        style={{ width: 300 }}
        value={selectedTeam}
        onChange={handleSelectChange}
        renderInput={(params) => <TextField {...params} label="select team" />}
      />
      <Content>
        <ContentItem>
          <TextField
            label="CITY"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: 400 }}
          />
        </ContentItem>
      </Content>
      <Content>
        <ContentItem>
          <TextField
            label="NICKNAME"
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ width: 400 }}
          />
        </ContentItem>
      </Content>
      <Content>
        <ContentItem>
          <TextField
            label="BYE WEEK"
            variant="outlined"
            value={byeWeek}
            onChange={(e) => setByeWeek(e.target.value)}
            style={{ width: 400 }}
          />
        </ContentItem>
        <ContentItem>
          <Button onClick={saveChanges} variant="contained" color="primary">
            save changes
          </Button>
        </ContentItem>
      </Content>
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

export default TeamsPage;
