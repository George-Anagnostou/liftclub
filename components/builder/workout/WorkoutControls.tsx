import React from "react";
import styled from "styled-components";
import { useStoreState } from "../../../store";
import { Workout } from "../../../utils/interfaces";
// Components
import Checkmark from "../../Checkmark";

interface Props {
  customWorkout: Workout;
  handleWorkoutNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  workoutSavedSuccessfully: boolean | null;
  saveCustomWorkout: () => Promise<void>;
  clearCustomWorkout: () => void;
  handlePrivacyChange: () => void;
}

const CustomWorkoutControls: React.FC<Props> = ({
  customWorkout,
  handleWorkoutNameChange,
  workoutSavedSuccessfully,
  saveCustomWorkout,
  clearCustomWorkout,
  handlePrivacyChange,
}) => {
  const { user } = useStoreState();

  return (
    <ControlsBar>
      <div className="input-wrapper">
        <input
          type="text"
          name="workoutName"
          value={customWorkout.name}
          onChange={handleWorkoutNameChange}
          placeholder="Name your workout"
        />

        {workoutSavedSuccessfully && (
          <Checkmark styles={{ position: "absolute", right: "1.4rem" }} />
        )}
      </div>

      <div className="controls">
        <button onClick={saveCustomWorkout} disabled={!Boolean(customWorkout.exercises.length)}>
          Save
        </button>

        <button
          onClick={clearCustomWorkout}
          disabled={!Boolean(customWorkout.name.length) && !Boolean(customWorkout.exercises.length)}
        >
          Clear
        </button>

        <div
          className={`checkbox ${!user?.isTrainer && "disabled"}`}
          onClick={user?.isTrainer ? handlePrivacyChange : () => {}}
        >
          <label htmlFor="public">Public</label>
          <input
            type="checkbox"
            name="public"
            checked={customWorkout.isPublic}
            readOnly={true}
            disabled={!user?.isTrainer}
          />
        </div>
      </div>
    </ControlsBar>
  );
};

export default CustomWorkoutControls;

const ControlsBar = styled.div`
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
    justify-content: center;
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
      font-size: 0.8rem;

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
