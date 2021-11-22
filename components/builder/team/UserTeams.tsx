import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
import { getUserCreatedTeams } from "../../../store/actions/builderActions";
// API
import { getTeamById } from "../../../api-lib/fetchers";
// Interfaces
import { Team } from "../../../types/interfaces";
// Components
import DeleteTeamModal from "./DeleteTeamModal";
import TiledList from "../../Wrappers/TiledList";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  clearTeam: () => void;
}

const UserTeams: React.FC<Props> = ({ team, setTeam, clearTeam }) => {
  const { user } = useUserState();
  const { teams } = useBuilderState();
  const builderDispatch = useBuilderDispatch();

  const router = useRouter();

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [loading, setLoading] = useState<string>("");
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  const handleTeamClick = async (team: Team) => {
    setLoading(team._id);

    const teamData = await getTeamById(team._id);
    if (teamData) setTeam(teamData);

    setLoading("");
  };

  useEffect(() => {
    if (user && !teams.created) getUserCreatedTeams(builderDispatch, user._id);
  }, [user]);

  // If url has query for specific team, set that team
  useEffect(() => {
    const queriedTeam_id = router.query.team as string;

    if (queriedTeam_id && teams.created && !hasQueriedUrl) {
      const queried = teams.created.find((each) => each._id === queriedTeam_id);

      if (queried) handleTeamClick(queried);
      setHasQueriedUrl(true);
    }
  }, [teams.created]);

  return (
    <>
      <div className="tile">
        <h3>My Teams</h3>

        <TiledList
          items={teams.created}
          onItemClick={(workout) => handleTeamClick(workout)}
          displayProp="teamName"
          onDeleteClick={(userTeam) => setTeamToDelete(userTeam)}
          keyProp="_id"
          isHighlighted={(userTeam) => team._id === userTeam._id}
          isLoading={(userTeam) => loading === userTeam._id}
        />
      </div>

      {teamToDelete && (
        <DeleteTeamModal
          team={teamToDelete}
          setTeamToDelete={setTeamToDelete}
          clearTeam={clearTeam}
        />
      )}
    </>
  );
};
export default UserTeams;
