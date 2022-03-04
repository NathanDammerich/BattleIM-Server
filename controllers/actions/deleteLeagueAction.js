import League from "../../models/League.js";
import Sport from "../../models/Sport.js";
import { deleteDivisionAction } from "./deleteDivisionAction.js";

export const deleteLeagueAction = async (leagueID) => {
  // 1. Grab league and sport associated with that league
  // 2. Update sport by removing leagueID from sport.leagues
  // 3. Delete all the divisions in the league (calling deleteDivisionAction which does all the necessary updates of deleting a division)
  // 4. Finally, delete league
  try {
    const league = await League.findById(leagueID).lean();

    const sportID = league.sport;
    const sport = await Sport.findById(sportID).lean();
    sport.leagues = sport.leagues.filter(
      (singleLeague) => singleLeague != leagueID
    );
    const updatedSport = await Sport.findByIdAndUpdate(sportID, sport);

    for (let division of league.divisions) {
      await deleteDivisionAction(division);
    }

    await League.deleteOne({ _id: leagueID });
  } catch (error) {
    throw error;
  }
};
