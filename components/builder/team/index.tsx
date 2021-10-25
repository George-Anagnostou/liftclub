import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { useUserDispatch, useUserState } from "../../../store";
// API
import { postNewTeam, updateTeam } from "../../../utils/api";
// Interfaces
import { Team } from "../../../utils/interfaces";
// Components
import ControlsBar from "./ControlsBar";
import UserTeams from "./UserTeams";
import TrainersTile from "./TrainersTile";
import RoutinesTile from "./RoutinesTile";
import { userJoiningTeam } from "../../../store/actions/userActions";

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
  const dispatch = useUserDispatch();

  const [team, setTeam] = useState<EditableTeam>(initialTeam);
  const [teamSaved, setTeamSaved] = useState<boolean | null>(null);

  const saveTeam = async () => {
    if (team._id) {
      const saved = await updateTeam(team);
      setTeamSaved(saved);
    } else {
      const team_id = await postNewTeam(team);
      if (team_id) {
        setTeamSaved(true);
        setTeam({ ...team, _id: team_id });
        userJoiningTeam(dispatch, user!._id, team_id);
      }
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
    <TeamBuilderContainer>
      <ControlsBar
        team={team}
        setTeam={setTeam}
        clearTeam={clearTeam}
        saveTeam={saveTeam}
        teamSaved={teamSaved}
      />

      <UserTeams team={team} setTeam={setTeam} teamSaved={teamSaved} clearTeam={clearTeam} />

      <RoutinesTile team={team} setTeam={setTeam} />

      <TrainersTile team={team} setTeam={setTeam} />
    </TeamBuilderContainer>
  );
};
export default TeamBuilder;

const TeamBuilderContainer = styled.section`
  .tile {
    width: 100%;
    border-radius: 5px;
    background: ${({ theme }) => theme.background};
    margin-bottom: 0.5rem;
  }

  h3 {
    text-align: left;
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
