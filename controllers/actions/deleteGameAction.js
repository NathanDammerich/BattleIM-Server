import Game from "../../models/Game.js";
import Division from "../../models/Division.js";
import League from "../../models/League.js";
import Team from "../../models/Team.js";

export const deleteGameAction = async (gameID) => {
  // 1. Grab game and league and division associated with that game
  // 2. Update division by removing gameID from division.games
  // 3. Grab teams associated with game and update teams by removing gameID from team.games
  // 4. Finally, delete game
  try {
    const game = await Game.findById(gameID).lean();
    const league = await League.findById(game.leagueID).lean();

    const divisionID = league.division;
    const division = await Division.findById(divisionID).lean();
    division.games = division.games.filter((oneGame) => oneGame != gameID);
    const updatedDivision = await Division.findByIdAndUpdate(
      divisionID,
      division
    );

    const homeTeam = await Team.findById(game.homeTeam).lean();
    const awayTeam = await Team.findById(game.awayTeam).lean();
    homeTeam.games = homeTeam.games.filter(
      (singleGame) => singleGame != gameID
    );
    awayTeam.games = awayTeam.games.filter(
      (singleGame) => singleGame != gameID
    );
    const newHomeTeam = await Team.findByIdAndUpdate(homeTeam._id, homeTeam);
    const newAwayTeam = await Team.findByIdAndUpdate(awayTeam._id, awayTeam);

    await Game.deleteOne({ _id: gameID });
  } catch (error) {
    throw error;
  }
};
