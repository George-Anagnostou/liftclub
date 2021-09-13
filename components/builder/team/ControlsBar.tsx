import React from "react";
import styled from "styled-components";
// Components
import Checkmark from "../../Checkmark";
// Interfaces
import { EditableTeam } from "./index";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
  clearTeam: () => void;
  saveTeam: () => void;
  teamSaved: boolean | null;
}

const ControlsBar: React.FC<Props> = ({ team, setTeam, clearTeam, saveTeam, teamSaved }) => {
  const handleTeamNameChange = (e) => {
    setTeam((prev) => ({ ...prev, teamName: e.target.value }));
  };

  return (
    <Container>
      <div className="input-wrapper">
        <input
          type="text"
          name="teamName"
          value={team.teamName}
          onChange={handleTeamNameChange}
          placeholder="Name your team"
        />

        {teamSaved && <Checkmark styles={{ position: "absolute", right: "1.4rem" }} />}
      </div>
      <div className="controls">
        <button onClick={saveTeam} disabled={!Boolean(team.teamName && team.routine_id)}>
          Save
        </button>

        <button
          onClick={clearTeam}
          disabled={!Boolean(team.teamName.length || team.routine_id.length | team.trainers.length)}
        >
          Clear
        </button>
      </div>
    </Container>
  );
};
export default ControlsBar;

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
