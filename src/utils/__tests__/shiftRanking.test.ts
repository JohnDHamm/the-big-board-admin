import { swapRankings } from '../shiftRanking';

describe('swapRankings', () => {
  it('should return rankings with swapped rank', () => {
    const testRank1: SelectedRanking = {
      rank: 1,
      _id: 'rank 1 id',
      position: 'D',
      scoringType: 'non-ppr',
      playerId: 'first player id',
      name: 'First Player',
      teamAbbv: 'TN',
    };
    const testRank2: SelectedRanking = {
      rank: 2,
      _id: 'rank 2 id',
      position: 'D',
      scoringType: 'non-ppr',
      playerId: 'second player id',
      name: 'Second Player',
      teamAbbv: 'AR',
    };
    expect(
      swapRankings({
        first: testRank1,
        second: testRank2,
      })
    ).toEqual([
      {
        rank: 1,
        _id: testRank1._id,
        position: testRank2.position,
        scoringType: testRank2.scoringType,
        playerId: testRank2.playerId,
        name: testRank2.name,
        teamAbbv: testRank2.teamAbbv,
      },
      {
        rank: 2,
        _id: testRank2._id,
        position: testRank1.position,
        scoringType: testRank1.scoringType,
        playerId: testRank1.playerId,
        name: testRank1.name,
        teamAbbv: testRank1.teamAbbv,
      },
    ]);
  });
});
