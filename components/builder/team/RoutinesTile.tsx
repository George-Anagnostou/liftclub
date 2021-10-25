import React from "react";
import styled from "styled-components";
// Context
import { useBuilderState } from "../../../store";
// Interfaces
import { EditableTeam } from "./index";
import { Routine } from "../../../utils/interfaces";

interface Props {
  team: EditableTeam;
  setTeam: React.Dispatch<React.SetStateAction<EditableTeam>>;
}
const RoutinesTile: React.FC<Props> = ({ team, setTeam }) => {
  const { routines } = useBuilderState();

  const handleRoutineClick = (routine: Routine) => {
    setTeam({ ...team, routine: routine, routine_id: routine._id });
  };

  return (
    <Container className="tile">
      <h3>Your Routines</h3>
      <ul>
        {routines.created ? (
          routines.created.map((routine) => (
            <li
              key={routine._id}
              onClick={() => handleRoutineClick(routine)}
              className={team.routine?._id === routine._id ? "highlight" : ""}
            >
              {routine.name}
            </li>
          ))
        ) : (
          <p className="fallbackText">None</p>
        )}
      </ul>
    </Container>
  );
};

export default RoutinesTile;

const Container = styled.div`
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      font-weight: 300;

      button {
        font-size: 0.7rem;
        font-weight: 600;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        margin-left: 0.3rem;
        height: 20px;
        width: 20px;
        padding: 0;
        transition: all 0.25s ease;
      }

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};

        button {
          background: ${({ theme }) => theme.accent};
          color: ${({ theme }) => theme.accentText};
        }
      }
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
