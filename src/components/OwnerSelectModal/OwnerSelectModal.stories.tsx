import React from 'react';
import OwnerSelectModal from './OwnerSelectModal';

export default {
  title: 'OwnerSelectModal',
  component: OwnerSelectModal,
};

export const Default = () => (
  <OwnerSelectModal
    visible={true}
    title="draft order #4"
    onCancel={() => console.log('cancelled')}
    onSelect={(owner) => console.log('owner', owner)}
    ownersForSelect={[
      {
        _id: 'gsgadsga',
        name: 'John',
        leagueId: 'dsafsdfs',
        isCommish: true,
      },
    ]}
  />
);
