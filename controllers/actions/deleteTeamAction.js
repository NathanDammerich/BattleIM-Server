import Team from "../../models/Team.js";
import User from "../../models/User.js";
import Division from "../../models/Division.js";

export const deleteTeamAction = async (teamID) => {
  // 1. Grab team and division associated with that team
  // 2. Update division by removing teamID from division.teams
  // 3. Update all the users on that team by removing teamID from user.teams
  // 4. Finally, delete team
  try {
    const team = await Team.findById(teamID).lean();

    const divisionID = team.division;
    const division = await Division.findById(divisionID).lean();
    division.teams = division.teams.filter(
      (singleTeam) => singleTeam != teamID
    );
    const updatedDivision = await Division.findByIdAndUpdate(
      divisionID,
      division
    );

    const players = team.players;

    for (let player of players) {
      const user = await User.findById(player).lean();
      user.teams = user.teams.filter((singleTeam) => singleTeam != teamID);
      const updatedUser = await User.findByIdAndUpdate(player, user);
    }

    await Team.deleteOne(teamID);
  } catch (error) {
    throw error;
  }
};
