import React, { useState, useEffect } from "react";
// Context
import { useBuilderDispatch, useUserDispatch, useUserState } from "../../../store";
import { userJoiningTeam } from "../../../store/actions/userActions";
import {
  addTeamToCreatedTeams,
  updateExistingCreatedTeam,
} from "../../../store/actions/builderActions";
// Interfaces
import { Team } from "../../../types/interfaces";
// Components
import ControlsBar from "./ControlsBar";
import UserTeams from "./UserTeams";
import TrainersTile from "./TrainersTile";
import RoutinesTile from "./RoutinesTile";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type EditableTeam = Optional<Team, "_id" | "routine">;

const initialTeam: EditableTeam = {
  _id: "",
  teamName: "",
  members: [],
  dateCreated: "",
  creatorName: "",
  creator_id: "",
  trainers: [],
  routine_id: "",
  routine: undefined,
};

const TeamBuilder: React.FC = () => {
  const { user } = useUserState();
  const userDispatch = useUserDispatch();
  const builderDispatch = useBuilderDispatch();

  const [team, setTeam] = useState<EditableTeam>(initialTeam);
  const [teamSaved, setTeamSaved] = useState<boolean | null>(null);

  const saveTeam = async () => {
    let saved: boolean = false;

    if (team._id) {
      saved = await updateExistingCreatedTeam(builderDispatch, team);
    } else {
      const team_id = await addTeamToCreatedTeams(builderDispatch, team);
      if (team_id) {
        saved = true;
        userJoiningTeam(userDispatch, user!._id, team_id);
      }
    }

    if (saved) {
      setTeamSaved(true);
      clearTeam();
    }
  };

  const clearTeam = () => {
    setTeam({
      ...initialTeam,
      creator_id: user!._id,
      creatorName: user!.username,
    });
  };

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;
    if (teamSaved) resetTimeout = setTimeout(() => setTeamSaved(null), 3000);
    return () => clearTimeout(resetTimeout);
  }, [teamSaved]);

  useEffect(() => {
    if (user)
      setTeam({ ...team, creatorName: user.username, creator_id: user._id, members: [user!._id] });
  }, [user]);

  return (
    <>
      <ControlsBar
        team={team}
        setTeam={setTeam}
        clearTeam={clearTeam}
        saveTeam={saveTeam}
        teamSaved={teamSaved}
      />

      <UserTeams team={team} setTeam={setTeam} clearTeam={clearTeam} />

      <RoutinesTile team={team} setTeam={setTeam} />

      <TrainersTile team={team} setTeam={setTeam} />
    </>
  );
};
export default TeamBuilder;
