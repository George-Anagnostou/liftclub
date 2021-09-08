import React, { useState } from "react";
import styled from "styled-components";
// Interfaces
import { Team, Routine } from "../../../utils/interfaces";

const initialTeam = {
  _id: "",
  teamName: "",
  members: [],
  dateCreated: "",
  creatorName: "",
  creator_id: "",
  trainers: [],
  routine_id: "",
  routine: {},
};

const TeamBuilder: React.FC = () => {
  const [team, setTeam] = useState(initialTeam);

  const handleTeamNameChange = (e) => {
    setTeam((prev) => ({ ...prev, teamName: e.target.value }));
  };

  const saveTeam = () => {
    console.log(team);
  };

  const clearTeam = () => {
    setTeam(initialTeam);
  };

  return (
    <div>
      <Container>
        <div className="input-wrapper">
          <input
            type="text"
            name="teamName"
            value={team.teamName}
            onChange={handleTeamNameChange}
            placeholder="Name your team"
          />

          {/* {routineSaved && <Checkmark styles={{ position: "absolute", right: "1.4rem" }} />} */}
        </div>
        <div className="controls">
          <button onClick={saveTeam} disabled={!Boolean(team.teamName)}>
            Save
          </button>

          <button onClick={clearTeam} disabled={!Boolean(team.teamName.length)}>
            Clear
          </button>
        </div>
      </Container>
    </div>
  );
};
export default TeamBuilder;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  width: 100%;
  padding: 0.5rem;

  .input-wrapper {
    border-radius: 5px;
    width: 100%;
    background: ${({ theme }) => theme.buttonMed};

    display: flex;
    align-items: center;

    input[type="text"] {
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
      border: none;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      background: inherit;
    }
  }

  .controls {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.5rem;

    button {
      flex: 1;
      border: none;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.text};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      display: inline-block;
      padding: 0.25rem 1rem;
      font-size: 1rem;
      margin-right: 0.5rem;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.buttonMed};
      }
    }

    .checkbox {
      flex: 1;
      border: none;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonLight};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      color: ${({ theme }) => theme.text};
      display: inline-block;
      min-width: max-content;
      padding: 0.25rem 1rem;
      font-size: 1rem;

      &.disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.buttonMed};
      }

      input[type="checkbox"] {
        margin-left: 0.5rem;
        transform: scale(1.1);
        border: none;
      }
    }
  }
`;
