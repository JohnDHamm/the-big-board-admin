type NFL_Position = 'QB' | 'RB' | 'WR' | 'TE' | 'D' | 'K';

interface NFL_Ranking {
  nonPpr: number;
  ppr: number;
}

interface NFL_Player_Ranking {
  position?: NFL_Ranking;
  overall?: NFL_Ranking;
}

interface Player {
  firstName: string;
  lastName: string;
  teamId: string;
  position: NFL_Position;
}

type SavedPlayer = Player & Id;

type DisplayPlayer = SavedPlayer & { teamAbbv: string };
