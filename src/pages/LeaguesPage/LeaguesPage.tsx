import React from 'react';
import {
  Content,
  ContentItem,
  DeleteBtn,
  PageLayout,
  RadioBlock,
  RowContent,
  SelectBlock,
} from '../../layout';
import {
  DraftOrderBlock,
  DraftOrderNum,
  OwnerName,
  ScoringTypeBlock,
} from './LeaguesPage.styles';
import { OwnerSelectModal } from '../../components';
import {
  createLeague,
  getLeague,
  getLeaguesList,
  getOwners,
  updateLeague,
} from '../../api';
import { NFL_POSITIONS } from '../../constants';
import { Autocomplete } from '@material-ui/lab';
import { Button, Radio, TextField } from '@material-ui/core';
import sortBy from 'lodash.sortby';

type PositionSlotsList = {
  [key in NFL_Position]: number;
};

type DraftOrderList = {
  [key: number]: string;
};

const INITIAL_POSITION_SLOTS: PositionSlotsList = {
  QB: 2,
  RB: 4,
  WR: 4,
  TE: 2,
  D: 2,
  K: 2,
};

const slotsReducer = (
  state: PositionSlotsList,
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

const draftOrderReducer = (
  state: DraftOrderList,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'init':
      return action.payload;
    case 'clear':
      return {};
    case 'update':
      return {
        ...state,
        [action.payload.orderNumber]: action.payload.ownerId,
      };
    case 'delete':
      const newState: DraftOrderList = {};
      Object.keys(state)
        .filter((num) => num !== action.payload.toString())
        .forEach((key) => {
          const orderNum = parseInt(key);
          newState[orderNum] = state[orderNum];
        });
      return newState;
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
  const [draftOrder, draftOrderDispatch] = React.useReducer(
    draftOrderReducer,
    {}
  );
  // const [ownerSelectionList, setOwnerSelectionList] = React.useState<Owner[]>([]);
  const [draftStatus, setDraftStatus] = React.useState<DraftStatus>(
    'not started'
  );
  const [positionSlots, posSlotsDispatch] = React.useReducer(
    slotsReducer,
    INITIAL_POSITION_SLOTS
  );

  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [orderNumber, setOrderNumber] = React.useState<number>(0);

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    value: LeagueListItem | null
  ) => {
    if (value) {
      getLeague(value._id)
        .then((league: League) => {
          // console.log('league', league);
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
          const savedPosSlots: PositionSlotsList = INITIAL_POSITION_SLOTS;
          positionSlots.forEach((pos) => {
            savedPosSlots[pos.position] = pos.total;
          });
          posSlotsDispatch({
            type: 'init',
            payload: savedPosSlots,
          });
          const newDraftOrder: DraftOrderList = {};
          draftOrder.forEach((ownerId, idx) => {
            newDraftOrder[idx + 1] = ownerId;
          });
          draftOrderDispatch({
            type: 'init',
            payload: newDraftOrder,
          });
          setDraftStatus(draftStatus);
          setShowForm(true);
          setIsEditing(true);
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
    draftOrderDispatch({
      type: 'clear',
      payload: {},
    });
    setDraftStatus('not started');
    setSelectedLeague(null);
  };

  const initNewLeague = () => {
    clearForm();
    setShowForm(true);
    setIsEditing(false);
  };

  const getOwnerName = (ownerId: string): string => {
    const owner = owners.find((owner) => owner._id === ownerId);
    return owner ? owner.name : '';
  };

  const handleSelect = (orderNum: number) => {
    setOrderNumber(orderNum);
    setShowModal(true);
  };

  const handleOwnerSelect = (owner: Owner) => {
    draftOrderDispatch({
      type: 'update',
      payload: {
        orderNumber,
        ownerId: owner._id,
      },
    });
    setShowModal(false);
  };

  const deleteOwner = (orderNumber: number) => {
    draftOrderDispatch({
      type: 'delete',
      payload: orderNumber,
    });
  };

  const getLeagueData = () => {
    const newPositionSlots: Position_Slot[] = [];
    Object.keys(positionSlots as PositionSlotsList).forEach((key) => {
      newPositionSlots.push({
        position: key as NFL_Position,
        total: positionSlots[key],
      });
    });
    const newDraftOrder: string[] = [];
    for (let i = 1; i < Object.keys(draftOrder).length + 1; i++) {
      newDraftOrder.push(draftOrder[i]);
    }
    return { newPositionSlots, newDraftOrder };
  };

  const saveChanges = () => {
    const { newPositionSlots, newDraftOrder } = getLeagueData();
    if (selectedLeague) {
      const leagueChanges: League = {
        _id: selectedLeague._id,
        name,
        scoringType,
        draftStatus,
        positionSlots: newPositionSlots,
        draftOrder: newDraftOrder,
      };
      updateLeague(leagueChanges)
        .then((res) => {
          console.log('res', res);
          clearForm();
          setShowForm(false);
          setIsEditing(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      //TODO: show error for missing info
      console.warn('missing form fields');
    }
  };

  const saveLeague = () => {
    if (name.length > 0) {
      const { newPositionSlots, newDraftOrder } = getLeagueData();
      const newLeague: Omit<League, '_id'> = {
        name,
        scoringType,
        draftStatus,
        positionSlots: newPositionSlots,
        draftOrder: newDraftOrder,
      };
      createLeague(newLeague)
        .then((res) => {
          console.log('res', res);
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.log('err', err));
    } else {
      //TODO: show error for missing info
      console.warn('missing form fields');
    }
  };

  const renderDraftOrder = (): JSX.Element[] => {
    const list = [];
    for (let i = 1; i < owners.length + 1; i++) {
      list.push(
        <RowContent key={i}>
          <DraftOrderBlock>
            <DraftOrderNum>{i}</DraftOrderNum>
            {draftOrder[i] ? (
              <OwnerName>
                {getOwnerName(draftOrder[i])}
                <DeleteBtn onClick={() => deleteOwner(i)}>X</DeleteBtn>
              </OwnerName>
            ) : (
              <SelectBlock onClick={() => handleSelect(i)}>
                select owner
              </SelectBlock>
            )}
          </DraftOrderBlock>
        </RowContent>
      );
    }
    return list;
  };

  const renderPosSlots = (): JSX.Element[] => {
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
        .then((owners: Owner[]) => {
          setOwners(sortBy(owners, ['name']));
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

  React.useEffect(() => {
    // console.log('draftOrder', draftOrder);
    //TODO: update owners for select (don't include ones already with a spot)
  }, [draftOrder]);

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
          <ContentItem>{renderDraftOrder()}</ContentItem>
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
          {isEditing ? (
            <ContentItem>
              <Button onClick={saveChanges} variant="contained" color="primary">
                save changes
              </Button>
            </ContentItem>
          ) : (
            <ContentItem>
              <Button onClick={saveLeague} variant="contained" color="primary">
                save new league
              </Button>
            </ContentItem>
          )}
        </Content>
      )}
      <OwnerSelectModal
        onSelect={(owner) => handleOwnerSelect(owner)}
        onCancel={() => setShowModal(false)}
        title={`draft order #${orderNumber}`}
        visible={showModal}
        ownersForSelect={owners}
      />
    </PageLayout>
  );
};

export default LeaguesPage;
