import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { PageLayout } from '../../layout';
import { getTeams } from '../../api';
import { TextField } from '@material-ui/core';
import sortBy from 'lodash.sortby';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  const initPage = async () => {
    const teamsList: Team[] = await getTeams();
    setTeams(sortBy(teamsList, ['city']));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    value: NFL_Team | null
  ) => {
    console.log('value', value);
    setSelectedTeam(value);
  };

  React.useEffect(() => {
    console.log('selectedTeam', selectedTeam);
  }, [selectedTeam]);

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
    </PageLayout>
  );
};

export default TeamsPage;
