import React from 'react';
import RankPlayerSelectModal from './RankPlayerSelectModal';

export default {
  title: 'RankPlayerSelectModal',
  component: RankPlayerSelectModal,
};

export const Default = () => (
  <RankPlayerSelectModal
    visible={true}
    title="non-ppr WR #42"
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
