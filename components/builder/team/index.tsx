import React, { useState } from "react";
import styled from "styled-components";
import { useStoreState, useStoreDispatch } from "../../../store";
import update from "immutability-helper";
// Interfaces
import { Team, User } from "../../../utils/interfaces";
// Components
import UserTeams from "./UserTeams";
import TrainersTile from "./TrainersTile";
import ControlsBar from "./ControlsBar";

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
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [team, setTeam] = useState<EditableTeam>(initialTeam);

  const clearTeam = () => {
    setTeam(initialTeam);
  };

  return (
    <TeamBuilderContainer>
      <ControlsBar team={team} setTeam={setTeam} clearTeam={clearTeam} />

      <TrainersTile team={team} setTeam={setTeam} />

      <UserTeams team={team} setTeam={setTeam} />
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
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    font-weight: 300;
    margin: 0.5rem;
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
