import React from 'react';
import RankPlayerSelectModal from './RankPlayerSelectModal';

export default {
  title: 'RankPlayerSelectModal',
  component: RankPlayerSelectModal,
};

export const Default = () => (
  <RankPlayerSelectModal
    visible={true}
    rankInfo={{ position: 'WR', rankNumber: 42, scoringType: 'non-ppr' }}
    onCancel={() => console.log('cancelled')}
    onSelect={(player) => console.log('player', player)}
    playersForSelect={[
      {
        _id: 'gsgadsga',
        firstName: 'John',
        lastName: 'Hamm',
        teamId: 'sgsgdfhdfhd',
        position: 'WR',
        teamAbbv: 'BUF',
      },
    ]}
  />
);
