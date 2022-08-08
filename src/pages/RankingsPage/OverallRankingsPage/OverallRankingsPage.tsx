import React from 'react';
import {
  getOverallRankings,
  getPlayers,
  getTeams,
  updateOverallRanking,
} from '../../../api';
import {
  Content,
  ContentItem,
  ActionBtn,
  RadioBlock,
  SelectBlock,
} from '../../../layout';
import {
  ActionBtnContainer,
  RankBlock,
  RankNum,
  RankPlayer,
  TopContentItem,
} from '../RankingsPage.styles';
import { ScoringTypeBlock } from './OverallRankingsPage.styles';
import { RankPlayerSelectModal } from '../../../components';
import { Radio } from '@material-ui/core';
import isEmpty from 'lodash.isempty';
import sortBy from 'lodash.sortby';
import { swapRankings } from '../../../utils/shiftRanking';

type OverallRankingList = {
  [key: number]: SelectedRanking;
};

const reducer = (
  state: OverallRankingList,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'init':
      return action.payload;
    case 'update':
      updateOverallRanking(action.payload)
        .then((res) => null)
        .catch((err) => console.log('err', err));
      return { ...state, [action.payload.rank]: action.payload };
    default:
      return state;
  }
};

const OverallRankingsPage: React.FC = () => {
  const [players, setPlayers] = React.useState<SavedPlayer[]>([]);
  const [playersForSelect, setPlayersForSelect] = React.useState<
    DisplayPlayer[]
  >([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [scoringType, setScoringType] = React.useState<ScoringType>('non-ppr');

  const [rankingsList, dispatch] = React.useReducer(reducer, {});
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [rankNumber, setRankNumber] = React.useState<number>(0);

  const handleScoringTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoringType(event.target.value as ScoringType);
  };

  const deleteRank = (rankNum: number) => {
    const ranking = rankingsList[rankNum];
    const { _id, rank, scoringType } = ranking;
    const emptyRankList: SelectedRanking = {
      _id,
      rank,
      scoringType,
      playerId: '',
      name: '',
      position: 'QB', //position doesn't matter
      teamAbbv: '',
    };
    dispatch({
      type: 'update',
      payload: emptyRankList,
    });
  };

  const handleSelect = (rankNum: number) => {
    setRankNumber(rankNum);
    setShowModal(true);
  };

  const handlePlayerSelect = (player: DisplayPlayer) => {
    if (rankingsList) {
      const rankId = rankingsList[rankNumber]._id;
      const newRanking: SelectedRanking = {
        _id: rankId,
        playerId: player._id,
        scoringType,
        rank: rankNumber,
        name: `${player.firstName} ${player.lastName}`,
        position: player.position,
        teamAbbv: player.teamAbbv,
      };
      dispatch({
        type: 'update',
        payload: newRanking,
      });
      setShowModal(false);
    }
  };

  const shiftRank = (rankNum: number, direction: ShiftDirection) => {
    const secondRankNumber = direction === 'down' ? rankNum + 1 : rankNum - 1;
    const firstRanking: SelectedRanking = rankingsList[rankNum];
    const secondRanking: SelectedRanking = rankingsList[secondRankNumber];
    const newRankings = swapRankings({
      first: firstRanking,
      second: secondRanking,
    });
    newRankings.forEach((newRank) => {
      dispatch({
        type: 'update',
        payload: newRank,
      });
    });
  };

  const renderRankings = (): JSX.Element[] => {
    let list: JSX.Element[] = [];
    if (rankingsList && !isEmpty(players) && !isEmpty(teams)) {
      const rankTotal = Object.keys(rankingsList).length;
      if (rankTotal > 0) {
        for (let i = 1; i < rankTotal + 1; i++) {
          const { name, teamAbbv, position, _id, playerId } = rankingsList[i];
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
                  <ActionBtnContainer>
                    {i !== rankTotal && (
                      <ActionBtn onClick={() => shiftRank(i, 'down')}>
                        &#x2B07;
                      </ActionBtn>
                    )}
                    {i > 1 && (
                      <ActionBtn onClick={() => shiftRank(i, 'up')}>
                        &#x2B06;
                      </ActionBtn>
                    )}
                    <ActionBtn onClick={() => deleteRank(i)}>X</ActionBtn>
                  </ActionBtnContainer>
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
    if (!isEmpty(players) && !isEmpty(teams)) {
      getOverallRankings(scoringType)
        .then((rankings: SavedRanking[]) => {
          const newList: OverallRankingList = {};
          const sortedRankings = sortBy(rankings, ['rank']);
          sortedRankings.forEach((ranking) => {
            let name = '',
              position: NFL_Position = 'QB',
              teamAbbv = '';
            if (rankings.length > 0) {
              const player = players.find(
                (player) => player._id === ranking.playerId
              );
              if (player) {
                name = `${player.firstName} ${player.lastName}`;
                position = player.position;
                const team = teams.find((team) => team._id === player.teamId);
                if (team) {
                  teamAbbv = team.abbv;
                }
              }
            }
            newList[ranking.rank] = { ...ranking, name, position, teamAbbv };
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
    const newArray: DisplayPlayer[] = [];
    players.forEach((player) => {
      const team = teams.find((team) => team._id === player.teamId);
      if (team) {
        const newEntry: DisplayPlayer = { ...player, teamAbbv: team.abbv };
        newArray.push(newEntry);
      }
    });
    setPlayersForSelect(sortBy(newArray, ['lastName', 'firstName']));
  }, [players, setPlayersForSelect, teams]);

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
        </TopContentItem>
        <ContentItem>{renderRankings()}</ContentItem>
      </Content>
      <RankPlayerSelectModal
        onSelect={(player) => handlePlayerSelect(player)}
        onCancel={() => setShowModal(false)}
        title={`overall #${rankNumber} (${scoringType})`}
        visible={showModal}
        playersForSelect={playersForSelect}
      />
    </div>
  );
};

export default OverallRankingsPage;
