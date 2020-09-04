import React from 'react';
import { Content, ContentItem, PageLayout } from '../../layout';
import {
  createOwner,
  deleteOwner,
  getAllOwners,
  getLeaguesList,
  updateOwner,
} from '../../api';
import { Autocomplete } from '@material-ui/lab';
import { Button, Switch, TextField } from '@material-ui/core';
import sortBy from 'lodash.sortby';
import isEmpty from 'lodash.isempty';

type OwnerOption = {
  owner: Owner & Password;
  league: LeagueListItem;
};

const OwnersPage: React.FC = () => {
  const [owners, setOwners] = React.useState<(Owner & Password)[]>([]);
  const [leagues, setLeagues] = React.useState<LeagueListItem[]>([]);
  const [ownersOptions, setOwnersOptions] = React.useState<OwnerOption[]>([]);
  const [selectedOwner, setSelectedOwner] = React.useState<OwnerOption | null>(
    null
  );

  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [
    selectedOwnerLeague,
    setSelectedOwnerLeague,
  ] = React.useState<LeagueListItem | null>(null);
  const [isCommish, setIsCommish] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');

  const handleOwnerSelectChange = (
    event: React.ChangeEvent<{}>,
    value: OwnerOption | null
  ) => {
    if (value) {
      console.log('value', value);
      const { name, isCommish, password } = value.owner;
      setSelectedOwner(value);
      setName(name);
      setSelectedOwnerLeague(value.league);
      setIsCommish(isCommish);
      setPassword(password);
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleLeagueSelectChange = (
    event: React.ChangeEvent<{}>,
    value: LeagueListItem | null
  ) => {
    if (value) {
      console.log('value', value);
      setSelectedOwnerLeague(value);
    }
  };

  const clearForm = () => {
    setSelectedOwner(null);
    setName('');
    setSelectedOwnerLeague(null);
    setIsCommish(false);
    setPassword('');
    setIsEditing(false);
  };

  const initNewOwner = () => {
    clearForm();
    setShowForm(true);
  };

  const cancelUpdate = () => {
    clearForm();
    setShowForm(false);
  };

  const saveChanges = () => {
    if (
      selectedOwner &&
      selectedOwnerLeague &&
      name !== '' &&
      password !== ''
    ) {
      updateOwner({
        _id: selectedOwner?.owner._id,
        leagueId: selectedOwnerLeague?._id,
        name,
        isCommish,
        password,
      })
        .then((res) => {
          const newList = owners.filter((owner) => owner._id !== res._id);
          newList.push(res);
          setOwners(sortBy(newList, ['name']));
          clearForm();
          setShowForm(false);
          setIsEditing(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      console.error("something wrong - can't update");
    }
  };

  const saveNewOwner = () => {
    if (selectedOwnerLeague && name !== '' && password !== '') {
      const newOwner: NewOwner = {
        name,
        leagueId: selectedOwnerLeague?._id,
        isCommish,
        password,
      };
      createOwner(newOwner)
        .then((res) => {
          const newList = owners.filter((owner) => owner._id !== res._id);
          newList.push(res);
          setOwners(sortBy(newList, ['name']));
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      console.error('missing form fields');
    }
  };

  const submitDelete = () => {
    if (selectedOwner) {
      deleteOwner(selectedOwner?.owner._id)
        .then((res) => {
          const newList = owners.filter((owner) => owner._id !== res._id);
          setOwners(sortBy(newList, ['name']));
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      console.error("can't delete");
    }
  };

  React.useEffect(() => {
    if (!isEmpty(owners) && !isEmpty(leagues)) {
      const options: OwnerOption[] = [];
      owners.forEach((owner) => {
        const league: LeagueListItem | undefined = leagues.find(
          (league) => league._id === owner.leagueId
        );
        if (league) {
          options.push({
            owner,
            league,
          });
        }
      });
      setOwnersOptions(options);
    }
  }, [owners, leagues]);

  React.useEffect(() => {
    getAllOwners()
      .then((owners) => {
        setOwners(sortBy(owners, ['name']));
      })
      .then(() => getLeaguesList())
      .then((leagues) => {
        setLeagues(leagues);
      })
      .catch((err) => console.log('err', err));
  }, []);

  return (
    <PageLayout>
      {!showForm && (
        <Content>
          <ContentItem>
            <Autocomplete
              id="owners-select"
              options={ownersOptions}
              getOptionLabel={(option) =>
                `${option.owner.name} - ${option.league.name}`
              }
              style={{ width: 300 }}
              value={selectedOwner}
              onChange={handleOwnerSelectChange}
              renderInput={(params) => (
                <TextField {...params} label="select owner" />
              )}
            />
          </ContentItem>
          <ContentItem>
            <Button onClick={initNewOwner} variant="contained" color="primary">
              add owner
            </Button>
          </ContentItem>
        </Content>
      )}
      {showForm && (
        <Content>
          <ContentItem>
            <TextField
              label="OWNER NAME"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 400 }}
            />
          </ContentItem>

          <ContentItem>
            {isEditing ? (
              <>
                <p style={{ margin: 0 }}>LEAGUE:</p>
                <p>{selectedOwnerLeague?.name}</p>
              </>
            ) : (
              <Autocomplete
                id="league-select"
                options={leagues}
                getOptionLabel={(option) => `${option.name}`}
                style={{ width: 300 }}
                value={selectedOwnerLeague}
                onChange={handleLeagueSelectChange}
                renderInput={(params) => (
                  <TextField {...params} label="league" />
                )}
              />
            )}
          </ContentItem>
          <ContentItem>
            <p style={{ margin: 0 }}>League Commish?</p>
            <Switch
              checked={isCommish}
              onChange={(e) => setIsCommish(e.target.checked)}
              name="isCommish"
              color="primary"
            />
          </ContentItem>
          <ContentItem>
            <TextField
              label="PASSWORD"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: 400 }}
            />
          </ContentItem>
          {isEditing ? (
            <>
              <ContentItem>
                <Button
                  onClick={saveChanges}
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
                  delete owner
                </Button>
              </ContentItem>
            </>
          ) : (
            <>
              <ContentItem>
                <Button
                  onClick={saveNewOwner}
                  variant="contained"
                  color="primary"
                >
                  save new owner
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
    </PageLayout>
  );
};

export default OwnersPage;
