import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../../store";
// API
import { getRoutinesFromCreatorId } from "../../../utils/api";
// Interfaces
import { Routine } from "../../../utils/interfaces";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
}

const UserRoutines: React.FC<Props> = ({ routine, setRoutine }) => {
  const { user } = useStoreState();

  const [userRoutines, setUserRoutines] = useState<Routine[] | null>(null);

  const handleRoutineClick = async (rout: Routine) => {
    setRoutine(rout);
  };

  useEffect(() => {
    if (user) {
      const getUserRoutines = async () => {
        const routines = await getRoutinesFromCreatorId(user._id);
        if (routines) setUserRoutines(routines);
      };

      getUserRoutines();
    }
  }, [user]);

  return (
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
            </li>
          ))
        ) : (
          <p className="fallbackText">None</p>
        )}
      </ul>
    </Container>
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
      padding: 0.5rem 1rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
