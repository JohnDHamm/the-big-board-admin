import React from 'react';
import { PageLayout } from '../../layout';
import {
  Content,
  ContentItem,
  RadioBlock,
  RowContent,
  ScoringTypeBlock,
} from './LeaguesPage.styles';
import { getLeague, getLeaguesList, getOwners } from '../../api';
import { NFL_POSITIONS } from '../../constants';
import { Autocomplete } from '@material-ui/lab';
import { Button, Radio, TextField } from '@material-ui/core';

type PositionSlots = {
  [key in NFL_Position]: number;
};

const INITIAL_POSITION_SLOTS: PositionSlots = {
  QB: 2,
  RB: 4,
  WR: 4,
  TE: 2,
  D: 2,
  K: 2,
};

const slotsReducer = (
  state: PositionSlots,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'init':
      return action.payload;
    case 'update':
      return { ...state, [action.payload.position]: action.payload.total };
    default:
      return state;
  }
};

const LeaguesPage: React.FC = () => {
  const [leagues, setLeagues] = React.useState<LeagueListItem[]>([]);
  const [selectedLeague, setSelectedLeague] = React.useState<League | null>(
    null
  );
  const [scoringType, setScoringType] = React.useState<ScoringType>('non-ppr');
  const [draftOrder, setDraftOrder] = React.useState<string[]>([]);
  const [draftStatus, setDraftStatus] = React.useState<DraftStatus>(
    'not started'
  );
  const [positionSlots, posSlotsDispatch] = React.useReducer(
    slotsReducer,
    INITIAL_POSITION_SLOTS
  );

  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    value: LeagueListItem | null
  ) => {
    if (value) {
      getLeague(value._id)
        .then((league: League) => {
          console.log('league', league);
          const {
            scoringType,
            draftOrder,
            draftStatus,
            name,
            positionSlots,
          } = league;
          setSelectedLeague(league);
          setName(name);
          setScoringType(scoringType);
          const savedPosSlots: PositionSlots = INITIAL_POSITION_SLOTS;
          positionSlots.forEach((pos) => {
            savedPosSlots[pos.position] = pos.total;
          });
          posSlotsDispatch({
            type: 'init',
            payload: savedPosSlots,
          });
          setDraftOrder(draftOrder);
          setDraftStatus(draftStatus);
          setShowForm(true);
        })
        .catch((err) => console.log('err', err));
    }
  };

  const handleScoringTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoringType(event.target.value as ScoringType);
  };

  const handleDraftStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDraftStatus(event.target.value as DraftStatus);
  };

  const clearForm = () => {
    setName('');
    setScoringType('non-ppr');
    posSlotsDispatch({
      type: 'init',
      payload: INITIAL_POSITION_SLOTS,
    });
    setDraftOrder([]);
    setDraftStatus('not started');
    setSelectedLeague(null);
  };

  const initNewLeague = () => {
    clearForm();
    setShowForm(true);
  };

  const renderPosSlots = () => {
    return NFL_POSITIONS.map((pos) => {
      return (
        <TextField
          key={pos}
          label={pos}
          variant="outlined"
          type="number"
          value={positionSlots[pos]}
          onChange={(e) =>
            posSlotsDispatch({
              type: 'update',
              payload: {
                position: pos,
                total: parseInt(e.target.value),
              },
            })
          }
          style={{ width: 60, marginRight: '0.5rem' }}
        />
      );
    });
  };

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
      .catch((err) => console.log('err', err));
  }, []);

  return (
    <PageLayout>
      {!showForm && (
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
          <ContentItem>
            <Button onClick={initNewLeague} variant="contained" color="primary">
              add league
            </Button>
          </ContentItem>
        </Content>
      )}
      {showForm && (
        <Content>
          <ContentItem>
            <TextField
              label="LEAGUE NAME"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 400 }}
            />
          </ContentItem>
          <RowContent>
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
              <RowContent>{renderPosSlots()}</RowContent>
            </ContentItem>
          </RowContent>
          <RowContent>
            <RadioBlock key="not started">
              <Radio
                checked={draftStatus === 'not started'}
                onChange={handleDraftStatusChange}
                value={'not started'}
                name="draftStatus-radio"
                color="primary"
              />
              <p>not started</p>
            </RadioBlock>
            <RadioBlock key="open">
              <Radio
                checked={draftStatus === 'open'}
                onChange={handleDraftStatusChange}
                value={'open'}
                name="draftStatus-radio"
                color="primary"
              />
              <p>open</p>
            </RadioBlock>
            <RadioBlock key="paused">
              <Radio
                checked={draftStatus === 'paused'}
                onChange={handleDraftStatusChange}
                value={'paused'}
                name="draftStatus-radio"
                color="primary"
              />
              <p>paused</p>
            </RadioBlock>
            <RadioBlock key="done">
              <Radio
                checked={draftStatus === 'done'}
                onChange={handleDraftStatusChange}
                value={'done'}
                name="draftStatus-radio"
                color="primary"
              />
              <p>done</p>
            </RadioBlock>
          </RowContent>
        </Content>
      )}
    </PageLayout>
  );
};

export default LeaguesPage;
