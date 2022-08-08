interface ShiftRankingObject {
  first: SelectedRanking;
  second: SelectedRanking;
}

export const swapRankings = (
  shiftObj: ShiftRankingObject
): SelectedRanking[] => {
  const newFirst: SelectedRanking = {
    ...shiftObj.second,
    rank: shiftObj.first.rank,
    _id: shiftObj.first._id,
  };
  const newSecond: SelectedRanking = {
    ...shiftObj.first,
    rank: shiftObj.second.rank,
    _id: shiftObj.second._id,
  };
  return [newFirst, newSecond];
};
