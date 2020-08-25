import React from 'react';
import {
  Content,
  ContentItem,
  DeleteBtn,
  OwnerName,
  PickBlock,
  PickNum,
  PickPlayer,
} from './PicksPage.styles';
import { PageLayout } from '../../layout';
import {
  deletePick,
  getLeaguesList,
  getOwners,
  getPicks,
  getPlayers,
  getTeams,
} from '../../api';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import isEmpty from 'lodash.isempty';
import sortBy from 'lodash.sortby';

declare global {
  interface SavedPick {
    _id: string;
    selectionNumber: number;
    playerId: string;
    ownerId: string;
  }
}

interface Owner {
  _id: string;
  name: string;
  leagueId: string;
  isCommish: boolean;
}

type PickCardInfo = {
  ownerName: string;
  playerName: string;
  playerPosition: NFL_Position | '';
  teamAbbv: string;
};

type PickCard = SavedPick & PickCardInfo;

type PicksList = {
  [key: number]: PickCard;
};

const reducer = (
  state: PicksList,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'init':
      return action.payload;
    case 'delete':
      deletePick(action.payload._id)
        .then((res) => null)
        .catch((err) => console.log('err', err));
      const newState: PicksList = {};
      Object.keys(state)
        .filter((num) => num !== action.payload.selectionNumber.toString())
        .forEach((key) => {
          const pickNum = parseInt(key);
          newState[pickNum] = state[pickNum];
        });

      return newState;
    // case 'update':
    //   updateOverallRanking(action.payload)
    //     .then((res) => null)
    //     .catch((err) => console.log('err', err));
    // return { ...state, [action.payload.selectionNumber]: action.payload };
    default:
      return state;
  }
};

const PicksPage: React.FC = () => {
  const [leagues, setLeagues] = React.useState<LeagueListItem[]>([]);
  const [
    selectedLeague,
    setSelectedLeague,
  ] = React.useState<LeagueListItem | null>(null);
  const [players, setPlayers] = React.useState<SavedPlayer[]>([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [owners, setOwners] = React.useState<Owner[]>([]);

  const [picks, dispatch] = React.useReducer(reducer, {});

  const deletePick = (pickNum: number) => {
    const pick = picks[pickNum];
    const { _id, selectionNumber } = pick;
    dispatch({
      type: 'delete',
      payload: { _id, selectionNumber },
    });
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    value: LeagueListItem | null
  ) => {
    setSelectedLeague(value);
  };

  const renderPicks = (): JSX.Element[] => {
    let list: JSX.Element[] = [];
    if (picks && !isEmpty(players) && !isEmpty(teams) && !isEmpty(owners)) {
      const picksTotal = Object.keys(picks).length;
      if (picksTotal > 0) {
        for (let i = 1; i < picksTotal + 1; i++) {
          if (picks[i]) {
            const {
              ownerName,
              playerName,
              teamAbbv,
              playerPosition,
              _id,
            } = picks[i];
            list.push(
              <PickBlock key={_id}>
                <PickNum>{i}</PickNum>
                <PickPlayer>
                  <div>
                    <OwnerName>{ownerName}: </OwnerName>
                    <span>{playerName}</span>
                    <span>{' - '}</span>
                    <span>{playerPosition}</span>
                    <span>{' | '}</span>
                    <span>{teamAbbv}</span>
                  </div>
                  <DeleteBtn onClick={() => deletePick(i)}>X</DeleteBtn>
                </PickPlayer>
              </PickBlock>
            );
          }
        }
      }
    }
    return list;
  };

  React.useEffect(() => {
    if (
      !isEmpty(leagues) &&
      selectedLeague &&
      !isEmpty(players) &&
      !isEmpty(teams) &&
      !isEmpty(owners)
    ) {
      getPicks(selectedLeague?._id)
        .then((picks: SavedPick[]) => {
          const newList: PicksList = {};
          const sortedPicks = sortBy(picks, ['selectionNumber']);
          sortedPicks.forEach((pick) => {
            let ownerName = '',
              playerName = '',
              playerPosition: NFL_Position | '' = '',
              teamAbbv = '';
            if (sortedPicks.length > 0) {
              const owner = owners.find((owner) => owner._id === pick.ownerId);
              if (owner) {
                ownerName = owner.name;
                const player = players.find(
                  (player) => player._id === pick.playerId
                );
                if (player) {
                  playerName = `${player.firstName} ${player.lastName}`;
                  playerPosition = player.position;
                  const team = teams.find((team) => team._id === player.teamId);
                  if (team) {
                    teamAbbv = team.abbv;
                  }
                }
              }
            }
            newList[pick.selectionNumber] = {
              ...pick,
              ownerName,
              playerName,
              playerPosition,
              teamAbbv,
            };
          });
          dispatch({
            type: 'init',
            payload: newList,
          });
        })
        .catch((err) => console.log('err', err));
    }
  }, [leagues, selectedLeague, players, teams, owners]);

  React.useEffect(() => {
    if (selectedLeague) {
      getOwners(selectedLeague._id)
        .then((owners) => {
          setOwners(owners);
        })
        .catch((err) => console.log('err', err));
    }
  }, [selectedLeague]);

  React.useEffect(() => {
    getLeaguesList()
      .then((list) => {
        setLeagues(list);
      })
      .then(() => getPlayers())
      .then((playersList: SavedPlayer[]) => {
        setPlayers(playersList);
      })
      .then(() => getTeams())
      .then((teamsList: Team[]) => {
        setTeams(teamsList);
      })
      .catch((err) => console.log('err', err));
  }, []);

  return (
    <PageLayout>
      <Content>
        <ContentItem>
          <Autocomplete
            id="leagues-select"
            options={leagues}
            getOptionLabel={(option) => `${option.name}`}
            style={{ width: 300 }}
            value={selectedLeague}
            onChange={handleSelectChange}
            renderInput={(params) => (
              <TextField {...params} label="select league" />
            )}
          />
        </ContentItem>
        <ContentItem>{renderPicks()}</ContentItem>
      </Content>
    </PageLayout>
  );
};

export default PicksPage;
