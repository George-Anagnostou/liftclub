import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useBuilderDispatch, useUserState } from "../../../store";
import {
  addRoutineToCreatedRoutines,
  updateExistingCreatedRoutine,
} from "../../../store/actions/builderActions";
// Interfaces
import { Routine } from "../../../utils/interfaces";
// Components
import Checkmark from "../../Checkmark";

interface Props {
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  routine: Routine;
  clearRoutine: () => void;
}

const ControlsBar: React.FC<Props> = ({ setRoutine, routine, clearRoutine }) => {
  const { user } = useUserState();
  const builderDispatch = useBuilderDispatch();

  const [routineSaved, setRoutineSaved] = useState<null | boolean>(null);

  const saveRoutine = async () => {
    let saved: boolean = false;

    saved = routine._id
      ? await updateExistingCreatedRoutine(builderDispatch, routine)
      : await addRoutineToCreatedRoutines(builderDispatch, routine, user!);

    if (saved) {
      setRoutineSaved(true);
      clearRoutine();
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

        {routineSaved && (
          <Checkmark styles={{ position: "absolute", right: 0, transform: "scale(0.7)" }} />
        )}
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
    position: relative;

    input[type="text"] {
      width: 100%;
      padding: 0.25rem 1rem;
      font-size: 1rem;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      background: inherit;
      border: 1px solid ${({ theme }) => theme.buttonMed};
      appearance: none;

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accentSoft};
      }
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
      font-size: 0.8rem;
      margin: 0 0.5rem;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.buttonMed};
        box-shadow: none;
      }
    }
  }
`;
