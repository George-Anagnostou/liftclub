import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../../store";
// API
import { getRoutinesFromCreatorId } from "../../../utils/api";
// Interfaces
import { Routine } from "../../../utils/interfaces";
// Components
import DeleteRoutineModal from "./DeleteRoutineModal";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  clearRoutine: () => void;
  routineSaved: boolean | null;
}

const UserRoutines: React.FC<Props> = ({ routine, setRoutine, clearRoutine, routineSaved }) => {
  const { user } = useStoreState();

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [userRoutines, setUserRoutines] = useState<Routine[] | null>(null);

  const handleRoutineClick = async (rout: Routine) => {
    setRoutine(rout);
  };

  // Set userRoutines on mount
  useEffect(() => {
    if (user && !routineSaved) {
      const getUserRoutines = async () => {
        const routines = await getRoutinesFromCreatorId(user._id);
        if (routines) setUserRoutines(routines);
      };

      getUserRoutines();
    }
  }, [user, routineToDelete, routineSaved]);

  return (
    <>
      {routineToDelete && (
        <DeleteRoutineModal
          routine={routineToDelete}
          setRoutineToDelete={setRoutineToDelete}
          clearRoutine={clearRoutine}
        />
      )}
      <Container>
        <h3>Your Routines</h3>
        <ul>
          {userRoutines ? (
            userRoutines.map((rout) => (
              <li
                onClick={() => handleRoutineClick(rout)}
                key={rout._id}
                className={routine._id === rout._id ? "highlight" : ""}
              >
                {rout.name}

                <button onClick={() => setRoutineToDelete(rout)}>x</button>
              </li>
            ))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </Container>
    </>
  );
};

export default UserRoutines;

const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

  h3 {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    font-weight: 300;
    margin: 0.5rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      position: relative;
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem 1.75rem 0.5rem 1rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;

      button {
        font-size: 0.9rem;
        font-weight: 600;

        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        position: absolute;
        top: 3px;
        right: 3px;
        padding: 0px 5px 1px;
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
