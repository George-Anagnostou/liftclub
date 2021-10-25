import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
import { getUserCreatedRoutines } from "../../../store/actions/builderActions";
// Interfaces
import { Routine } from "../../../utils/interfaces";
// Components
import DeleteRoutineModal from "./DeleteRoutineModal";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  clearRoutine: () => void;
}

const UserRoutines: React.FC<Props> = ({ routine, setRoutine, clearRoutine }) => {
  const { user } = useUserState();
  const { routines } = useBuilderState();
  const builderDispatch = useBuilderDispatch();

  const router = useRouter();

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  // Set routines created on mount
  useEffect(() => {
    if (user && !routines.created) getUserCreatedRoutines(builderDispatch, user._id);
  }, [user]);

  // If url has query for specific routine, set that routine
  useEffect(() => {
    const queriedRoutine_id = router.query.routine as string;

    if (queriedRoutine_id && routines.created && !hasQueriedUrl) {
      const queried = routines.created.find((each) => each._id === queriedRoutine_id);

      if (queried) setRoutine(queried);
      setHasQueriedUrl(true);
    }
  }, [routines.created]);

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
          {routines.created ? (
            routines.created.map((rout) => (
              <li
                key={rout._id}
                onClick={() => setRoutine(rout)}
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
    text-align: left;
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

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
