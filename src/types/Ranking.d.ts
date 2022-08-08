interface SavedRanking {
  _id: string;
  position: NFL_Position;
  scoringType: ScoringType;
  rank: number;
  playerId: string;
}

interface SelectedRankingInfo {
  name: string;
  teamAbbv: string;
}

type SelectedRanking = SavedRanking & SelectedRankingInfo;

type ShiftDirection = 'up' | 'down';

interface SavedOverallRanking {
  _id: string;
  scoringType: ScoringType;
  rank: number;
  playerId: string;
}
