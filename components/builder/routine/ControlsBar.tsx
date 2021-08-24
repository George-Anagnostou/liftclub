import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../../store";
// API
import { postNewRoutine, updateRoutine } from "../../../utils/api";
// Interfaces
import { Routine } from "../../../utils/interfaces";
// Components
import Checkmark from "../../Checkmark";

interface Props {
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  routine: Routine;
  clearRoutine: () => void;
  routineSaved: boolean | null;
  setRoutineSaved: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ControlsBar: React.FC<Props> = ({
  setRoutine,
  routine,
  clearRoutine,
  routineSaved,
  setRoutineSaved,
}) => {
  const { user } = useStoreState();

  const saveRoutine = async () => {
    const routineForDB: any = {
      ...routine,
      workoutPlan: routine!.workoutPlan.map(({ isoDate, workout_id }) => ({
        isoDate,
        workout_id,
      })),
    };

    if (routine._id) {
      // Saving an existing routine
      const saved = await updateRoutine(routineForDB);
      setRoutineSaved(saved);
    } else {
      // Saving a new routine
      routineForDB.creator_id = user!._id;
      routineForDB.creatorName = user!.username;
      routineForDB.name = routineForDB.name || "New Routine";
      delete routineForDB._id;

      const saved = await postNewRoutine(routineForDB);
      setRoutineSaved(saved);
      if (saved) clearRoutine();
    }
  };

  const handleRoutineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoutine((prev) => ({ ...prev, name: e.target.value }));
  };

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (routineSaved) resetTimeout = setTimeout(() => setRoutineSaved(null), 3000);

    return () => clearTimeout(resetTimeout);
  }, [routineSaved]);

  return (
    <Container>
      <div className="input-wrapper">
        <input
          type="text"
          name="routineName"
          value={routine.name}
          onChange={handleRoutineNameChange}
          placeholder="Name your routine"
        />

        {routineSaved && <Checkmark styles={{ position: "absolute", right: "1.4rem" }} />}
      </div>
      <div className="controls">
        <button onClick={saveRoutine} disabled={!Boolean(routine.workoutPlan.length)}>
          Save
        </button>

        <button
          onClick={clearRoutine}
          disabled={!Boolean(routine.name.length) && !Boolean(routine.workoutPlan.length)}
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