import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [userRoutines, setUserRoutines] = useState<Routine[] | null>(null);
  const [hasQueriedOnMount, setHasQueriedOnMount] = useState(false);

  const handleRoutineClick = async (rout: Routine) => {
    setRoutine(rout);
  };

  const getUserRoutines = async () => {
    if (!user) return;
    const routines = await getRoutinesFromCreatorId(user._id);
    if (routines) setUserRoutines(routines);
  };

  // Set userRoutines on mount
  useEffect(() => {
    if (user && !userRoutines) getUserRoutines();
  }, [user]);

  // Get the routines after user saves a routine
  useEffect(() => {
    if (routineSaved) getUserRoutines();
  }, [routineSaved]);

  useEffect(() => {
    const queriedRoutine_id = router.query.routine as string;

    if (queriedRoutine_id && userRoutines && !hasQueriedOnMount) {
      const queried = userRoutines.find((each) => each._id === queriedRoutine_id);
      
      if (queried) setRoutine(queried);
      setHasQueriedOnMount(true);
    }
  }, [userRoutines]);

  return (
    <>
      {routineToDelete && (
        <DeleteRoutineModal
          routine={routineToDelete}
          setRoutineToDelete={setRoutineToDelete}
          clearRoutine={clearRoutine}
          setUserRoutines={setUserRoutines}
        />
      )}
      <Container>
        <h3>Your Routines</h3>
        <ul>
          {userRoutines ? (
            userRoutines.map((rout) => (
              <li
                key={rout._id}
                onClick={() => handleRoutineClick(rout)}
                className={routine._id === rout._id ? "highlight" : ""}
              >
                {rout.name}

                <button onClick={() => setRoutineToDelete(rout)}>X</button>
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
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;

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
