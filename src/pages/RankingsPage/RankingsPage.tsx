import React from 'react';
import {
  Content,
  ContentItem,
  ScoringTypeBlock,
  RadioBlock,
} from './RankingsPage.styles';
import PositionRankingsPage from './PositionRankingsPage/PositionRankingsPage';
import PageLayout from '../../layout/PageLayout/PageLayout';
import { Radio } from '@material-ui/core';

type RankingType = 'position' | 'overall';
const RankingsPage: React.FC = () => {
  const [rankType, setRankType] = React.useState<RankingType>('position');

  const handleRankTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRankType(event.target.value as RankingType);
  };

  return (
    <PageLayout>
      <Content>
        <ContentItem>
          <ScoringTypeBlock>
            <RadioBlock key="position">
              <Radio
                checked={rankType === 'position'}
                onChange={handleRankTypeChange}
                value={'position'}
                name="rankType-radio"
                color="primary"
              />
              <p>position</p>
            </RadioBlock>
            <RadioBlock key="overall">
              <Radio
                checked={rankType === 'overall'}
                onChange={handleRankTypeChange}
                value={'overall'}
                name="rankType-radio"
                color="primary"
              />
              <p>overall</p>
            </RadioBlock>
          </ScoringTypeBlock>
        </ContentItem>
        {rankType === 'position' ? (
          <PositionRankingsPage />
        ) : (
          <p>OverallRankingsPage</p>
        )}
      </Content>
    </PageLayout>
  );
};

export default RankingsPage;
