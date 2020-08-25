import { deletePick } from './deletePick/deletePick';
import { deletePlayer } from './deletePlayer/deletePlayer';
import { getLeaguesList } from './getLeaguesList/getLeaguesList';
import { getOverallRankings } from './getOverallRankings/getOverallRankings';
import { getOwners } from './getOwners/getOwners';
import { getPicks } from './getPicks/getPicks';
import { getPlayers } from './getPlayers/getPlayers';
import { getPositionRankings } from './getPositionRankings/getPositionRankings';
import { getTeams } from './getTeams/getTeams';
import { savePlayer } from './savePlayer/savePlayer';
import { updateOverallRanking } from './updateOverallRanking/updateOverallRanking';
import { updatePlayer } from './updatePlayer/updatePlayer';
import { updatePositionRanking } from './updatePositionRanking/updatePositionRanking';

export const DEV_API_ROOT_URL = 'http://localhost:4001';

export {
  deletePick,
  deletePlayer,
  getLeaguesList,
  getOverallRankings,
  getOwners,
  getPicks,
  getPlayers,
  getPositionRankings,
  getTeams,
  savePlayer,
  updateOverallRanking,
  updatePlayer,
  updatePositionRanking,
};
