type ScoringType = 'ppr' | 'non-ppr';

interface Position_Slot {
  position: NFL_Position;
  total: number;
}

type DraftStatus = 'not started' | 'open' | 'paused' | 'done';

interface League {
  _id: string;
  name: string;
  scoringType: ScoringType;
  positionSlots: Position_Slot[];
  draftOrder: string[];
  draftStatus: DraftStatus;
}

type LeagueListItem = Pick<League, '_id' | 'name'>;
