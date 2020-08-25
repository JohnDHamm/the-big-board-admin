import React from 'react';
import {
  getPlayers,
  getPositionRankings,
  getTeams,
  updatePositionRanking,
} from '../../../api';
import {
  Content,
  ContentItem,
  DeleteBtn,
  RadioBlock,
  RankBlock,
  RankNum,
  RankPlayer,
  SelectBlock,
  ScoringTypeBlock,
  TopContentItem,
} from './PositionRankingsPage.styles';
import { PositionSelector, RankPlayerSelectModal } from '../../../components';
import { NFL_POSITIONS } from '../../../constants';
import { Radio } from '@material-ui/core';
import isEmpty from 'lodash.isempty';
import sortBy from 'lodash.sortby';

declare global {
  interface SavedRanking {
    _id: string;
    position: NFL_Position;
    scoringType: ScoringType;
    rank: number;
    playerId: string;
  }
}

interface SelectedRankingInfo {
  name: string;
  teamAbbv: string;
}

type SelectedRanking = SavedRanking & SelectedRankingInfo;

type RankingList = {
  [key in NFL_Position]: {
    [key: number]: SelectedRanking;
  };
};

const initialRankings: RankingList = {
  QB: {},
  RB: {},
  WR: {},
  TE: {},
  D: {},
  K: {},
};

const reducer = (
  state: RankingList,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'init':
      return action.payload;
    case 'update':
      const position: NFL_Position = action.payload.position;
      let newPosState = {
        ...state[position],
        ...{ [action.payload.data.rank]: action.payload.data },
      };
      updatePositionRanking(action.payload.data)
        .then((res) => null)
        .catch((err) => console.log('err', err));
      return { ...state, [position]: newPosState };
    default:
      return state;
  }
};

const PositionRankingsPage: React.FC = () => {
  const [players, setPlayers] = React.useState<SavedPlayer[]>([]);
  const [playersForSelect, setPlayersForSelect] = React.useState<
    DisplayPlayer[]
  >([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [scoringType, setScoringType] = React.useState<ScoringType>('non-ppr');
  const [selectedPosition, setSelectedPosition] = React.useState<NFL_Position>(
    'QB'
  );
  const [rankingsList, dispatch] = React.useReducer(reducer, initialRankings);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [rankNumber, setRankNumber] = React.useState<number>(0);

  const handleScoringTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoringType(event.target.value as ScoringType);
  };

  const handlePositionChange = (position: NFL_Position) => {
    setSelectedPosition(position);
  };

  const deleteRank = (rankNum: number) => {
    const ranking = rankingsList[selectedPosition][rankNum];
    const { _id, position, rank, scoringType } = ranking;
    const emptyRankList: SelectedRanking = {
      _id,
      position,
      rank,
      scoringType,
      playerId: '',
      name: '',
      teamAbbv: '',
    };
    dispatch({
      type: 'update',
      payload: {
        position,
        data: emptyRankList,
      },
    });
  };

  const handleSelect = (rankNum: number) => {
    setRankNumber(rankNum);
    setShowModal(true);
  };

  const handlePlayerSelect = (player: DisplayPlayer) => {
    if (rankingsList) {
      const rankId = rankingsList[selectedPosition][rankNumber]._id;
      const newRanking: SelectedRanking = {
        _id: rankId,
        playerId: player._id,
        position: player.position,
        scoringType,
        rank: rankNumber,
        name: `${player.firstName} ${player.lastName}`,
        teamAbbv: player.teamAbbv,
      };
      dispatch({
        type: 'update',
        payload: { position: player.position, data: newRanking },
      });
      setShowModal(false);
    }
  };

  const renderRankings = (): JSX.Element[] => {
    let list: JSX.Element[] = [];
    if (rankingsList && !isEmpty(players) && !isEmpty(teams)) {
      const posRankTotal = Object.keys(rankingsList[selectedPosition]).length;
      if (posRankTotal > 0) {
        for (let i = 1; i < posRankTotal + 1; i++) {
          const { name, teamAbbv, position, _id, playerId } = rankingsList[
            selectedPosition
          ][i];
          list.push(
            <RankBlock key={_id}>
              <RankNum>{i}</RankNum>
              {playerId.length > 0 ? (
                <RankPlayer>
                  <div>
                    <span>{name}</span>
                    <span>{' - '}</span>
                    <span>{position}</span>
                    <span>{' | '}</span>
                    <span>{teamAbbv}</span>
                  </div>
                  <DeleteBtn onClick={() => deleteRank(i)}>X</DeleteBtn>
                </RankPlayer>
              ) : (
                <SelectBlock onClick={() => handleSelect(i)}>
                  select player
                </SelectBlock>
              )}
            </RankBlock>
          );
        }
      }
    }
    return list;
  };

  React.useEffect(() => {
    const positionPlayers = players.filter(
      (player) => player.position === selectedPosition
    );
    const newArray: DisplayPlayer[] = [];
    positionPlayers.forEach((player) => {
      const team = teams.find((team) => team._id === player.teamId);
      if (team) {
        const newEntry: DisplayPlayer = { ...player, teamAbbv: team.abbv };
        newArray.push(newEntry);
      }
    });
    setPlayersForSelect(sortBy(newArray, ['lastName', 'firstName']));
  }, [selectedPosition, players, setPlayersForSelect, teams]);

  React.useEffect(() => {
    if (!isEmpty(players) && !isEmpty(teams)) {
      getPositionRankings(scoringType)
        .then((rankings: SavedRanking[]) => {
          const newList: RankingList = {
            QB: {},
            RB: {},
            WR: {},
            TE: {},
            D: {},
            K: {},
          };
          NFL_POSITIONS.forEach((pos) => {
            const posRankings = rankings.filter(
              (rank) => rank.position === pos
            );
            const sortedPosRankings = sortBy(posRankings, ['rank']);
            sortedPosRankings.forEach((posRank) => {
              let name = '',
                teamAbbv = '';
              if (posRankings.length > 0) {
                const player = players.find(
                  (player) => player._id === posRank.playerId
                );
                if (player) {
                  name = `${player.firstName} ${player.lastName}`;
                  const team = teams.find((team) => team._id === player.teamId);
                  if (team) {
                    teamAbbv = team.abbv;
                  }
                }
              }
              newList[pos][posRank.rank] = { ...posRank, name, teamAbbv };
            });
          });
          dispatch({
            type: 'init',
            payload: newList,
          });
        })
        .catch((err) => console.log('err', err));
    }
  }, [scoringType, players, teams]);

  React.useEffect(() => {
    getPlayers()
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
    <div>
      <Content>
        <TopContentItem>
          <ContentItem>
            <ScoringTypeBlock>
              <RadioBlock key="non-ppr">
                <Radio
                  checked={scoringType === 'non-ppr'}
                  onChange={handleScoringTypeChange}
                  value={'non-ppr'}
                  name="scoringType-radio"
                  color="primary"
                />
                <p>non-ppr</p>
              </RadioBlock>
              <RadioBlock key="ppr">
                <Radio
                  checked={scoringType === 'ppr'}
                  onChange={handleScoringTypeChange}
                  value={'ppr'}
                  name="scoringType-radio"
                  color="primary"
                />
                <p>ppr</p>
              </RadioBlock>
            </ScoringTypeBlock>
          </ContentItem>
          <ContentItem>
            <PositionSelector
              initialPosition={selectedPosition}
              onPositionChange={(pos) => handlePositionChange(pos)}
            />
          </ContentItem>
        </TopContentItem>
        <ContentItem>{renderRankings()}</ContentItem>
      </Content>
      <RankPlayerSelectModal
        onSelect={(player) => handlePlayerSelect(player)}
        onCancel={() => setShowModal(false)}
        title={`${selectedPosition} #${rankNumber} (${scoringType})`}
        visible={showModal}
        playersForSelect={playersForSelect}
      />
    </div>
  );
};

export default PositionRankingsPage;
