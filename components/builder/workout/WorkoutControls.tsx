import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUserState } from "../../../store";
import { Workout } from "../../../utils/interfaces";
// Components
import Checkmark from "../../Checkmark";

interface Props {
  customWorkout: Workout;
  handleWorkoutNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveCustomWorkout: () => Promise<boolean>;
  clearCustomWorkout: () => void;
  handlePrivacyChange: () => void;
}

const CustomWorkoutControls: React.FC<Props> = ({
  customWorkout,
  handleWorkoutNameChange,
  saveCustomWorkout,
  clearCustomWorkout,
  handlePrivacyChange,
}) => {
  const { user } = useUserState();

  const [workoutSavedSuccessfully, setWorkoutSavedSuccessfully] = useState<boolean | null>(null);

  const handleSaveClick = async () => {
    const saved = await saveCustomWorkout();
    setWorkoutSavedSuccessfully(saved);

    if (saved) clearCustomWorkout();
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfully) setTimeout(() => setWorkoutSavedSuccessfully(null), 3000);
  }, [workoutSavedSuccessfully]);

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
          <Checkmark styles={{ position: "absolute", right: 0, transform: "scale(0.7)" }} />
        )}
      </div>

      <div className="controls">
        <button onClick={handleSaveClick} disabled={!Boolean(customWorkout.exercises.length)}>
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
      transition: all 0.25s ease;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.buttonMed};
        box-shadow: none;
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
        box-shadow: none;
        input[type="checkbox"] {
          filter: brightness(0.5);
        }
      }

      input[type="checkbox"] {
        margin-left: 0.5rem;
        transform: scale(1.1);
        border: none;
      }
    }
  }
`;
