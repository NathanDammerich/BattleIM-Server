import Division from "../../models/Division.js";
import League from "../../models/League.js";

import { deleteTeamAction } from "./deleteTeamAction.js";
import { deleteGameAction } from "./deleteGameAction.js";

export const deleteDivisionAction = async (divisionID) => {
  // 1. Grab Division
  // 2. Update the league by removing divisionID from league.divisions
  // 3. Delete all games that were scheduled in that division (usually if you're deleting a division there wouldn't be any games yet)
  // 4. Delete all teams that are in that division (again, usually if you're deleting a division there wouldn't be any teams yet)
  // 5. Finally delete the division
  try {
    const division = await Division.findById(divisionID).lean();

    const leagueID = division.league;
    const league = await League.findById(leagueID).lean();
    league.divisions = league.divisions.filter(
      (oneDivision) => oneDivision != division._id
    );
    const updatedLeague = await League.findByIdAndUpdate(leagueID, league);

    const gameIDs = division.games;
    for (let game of gameIDs) {
      await deleteGameAction(game);
    }

    const teamIDs = division.teams;
    for (let team of teamIDs) {
      await deleteTeamAction(team);
    }

    await Division.deleteOne({ _id: divisionID });
  } catch (error) {
    throw error;
  }
};
