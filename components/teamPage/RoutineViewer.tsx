import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStoreState } from "../../store";
// Utils
import { stripTimeAndCompareDates } from "../../utils";
// API
import {
  getRoutineFromId,
  getUserMadeWorkouts,
  getWorkoutsFromIdArray,
  updateRoutine,
} from "../../utils/api";
// Components
import Calendar from "./Calendar";
// Interface
import { Routine, Team, Workout } from "../../utils/interfaces";

interface Props {
  routine_id: string;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
}

const RoutineContainer: React.FC<Props> = ({ routine_id, setTeam }) => {
  const { user, isSignedIn } = useStoreState();

  const [initialRoutineData, setInitialRoutineData] = useState<Routine | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [isRoutineOwner, setIsRoutineOwner] = useState(false);
  const [userMadeWorkouts, setUserMadeWorkouts] = useState<Workout[]>([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState<Workout[]>([]);

  const addWorkoutToRoutine = (workout) => {
    setRoutine(
      (prev) =>
        prev && {
          ...prev,
          workoutPlan: [
            ...prev.workoutPlan.filter((each) => each.isoDate !== selectedDate),
            { isoDate: selectedDate, workout_id: workout._id, workout },
          ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
        }
    );
  };

  const removeWorkoutFromRoutine = () => {
    setRoutine(
      (prev) =>
        prev && {
          ...prev,
          workoutPlan: [...prev.workoutPlan.filter((each) => each.isoDate !== selectedDate)],
        }
    );
  };

  const handleSaveRoutine = async () => {
    if (!routine) return;

    const routineForDB = {
      ...routine,
      workoutPlan: routine!.workoutPlan.map(({ isoDate, workout_id }) => ({
        isoDate,
        workout_id,
      })),
    };

    const saved = await updateRoutine(routineForDB);

    if (saved) {
      setTeam((prev) => ({ ...prev, routine: routineForDB }));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRoutine(initialRoutineData);
  };

  // Get the routine data from DB
  useEffect(() => {
    const getRoutineData = async () => {
      const routineData = await getRoutineFromId(routine_id);

      if (routineData) {
        setRoutine(routineData);

        setInitialRoutineData(routineData);

        setIsRoutineOwner(user!._id === routineData.creator_id);
      }
    };

    if (!routine) getRoutineData();
  }, [routine]);

  // If the user is the owner of the routine, get their saved and created workouts to use in the editor
  useEffect(() => {
    const getUserWorkouts = async () => {
      const workoutsMade = await getUserMadeWorkouts(user!._id);
      setUserMadeWorkouts(workoutsMade);

      const workoutsSaved = await getWorkoutsFromIdArray(user!.savedWorkouts || []);
      setUserSavedWorkouts(workoutsSaved.reverse());
    };

    if (isRoutineOwner && isSignedIn) getUserWorkouts();
  }, [isRoutineOwner, isSignedIn]);

  // Displays the data for the selected date & editor if in editing mode
  // If there is a workout, displays the
  const displaySelectedDateData = () => {
    const foundWorkout = routine!.workoutPlan.filter((item) =>
      stripTimeAndCompareDates(item.isoDate, selectedDate)
    )[0]?.workout;

    return (
      <div className="dateData">
        {selectedDate ? (
          foundWorkout ? (
            <div>
              <p>{foundWorkout.name}</p>
              <p>{foundWorkout.exercises.length} exercises</p>
            </div>
          ) : isEditing ? (
            <p className="textLight">Select a workout from below</p>
          ) : (
            <p className="textLight">No workout today</p>
          )
        ) : (
          <p className="textLight">Tap a date to view its workout</p>
        )}

        {isEditing && (
          <EditingWorkoutOptions>
            <h3 className="title">Created</h3>
            <ul>
              {userMadeWorkouts.map((workout) => (
                <li
                  onClick={() => {
                    if (selectedDate) {
                      foundWorkout?._id === workout._id
                        ? removeWorkoutFromRoutine()
                        : addWorkoutToRoutine(workout);
                    }
                  }}
                  key={workout._id}
                  className={`${foundWorkout?._id === workout._id ? "highlight" : ""}
                  ${selectedDate ? "" : "disable"}`}
                >
                  {workout.name}
                </li>
              ))}
            </ul>

            <h3 className="title">Saved</h3>
            <ul>
              {userSavedWorkouts.map((workout) => (
                <li
                  onClick={() => {
                    if (selectedDate) {
                      foundWorkout?._id === workout._id
                        ? removeWorkoutFromRoutine()
                        : addWorkoutToRoutine(workout);
                    }
                  }}
                  key={workout._id}
                  className={`${foundWorkout?._id === workout._id ? "highlight" : ""}
                  ${selectedDate ? "" : "disable"}`}
                >
                  {workout.name}
                </li>
              ))}
            </ul>
          </EditingWorkoutOptions>
        )}
      </div>
    );
  };

  return (
    <>
      {routine && (
        <Editor>
          <h3 className="title">Schedule</h3>

          {displaySelectedDateData()}

          <Calendar
            data={routine.workoutPlan}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />

          {isRoutineOwner && !isEditing && (
            <button className="editBtn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}

          {isEditing && (
            <div>
              <button className="bottomBtn" onClick={handleSaveRoutine}>
                Save
              </button>
              <button className="bottomBtn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          )}
        </Editor>
      )}
    </>
  );
};
export default RoutineContainer;

const Editor = styled.div`
  background: ${({ theme }) => theme.background};
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;

  .dateData {
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.5rem;
    border-radius: 5px;

    p {
      flex: 1;
      font-size: 1.1rem;

      &.textLight {
        color: ${({ theme }) => theme.textLight};
      }
    }

    div {
      display: flex;
    }
  }

  .editBtn {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 5px;
    padding: 0.25rem 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }

  .bottomBtn {
    border-radius: 5px;
    padding: 0.75rem;
    margin: 0 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }
`;

const EditingWorkoutOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonLight};

  h3 {
    margin-left: 0.5rem;
  }

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &:first-of-type {
      margin-bottom: 0.5rem;
    }

    li {
      background: ${({ theme }) => theme.background};
      margin: 0.25rem;
      padding: 0.5rem;
      border-radius: 5px;
      min-width: max-content;

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
      &.disable {
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.textLight};
      }
    }

    @media (max-width: 425px) {
      /* Remove scroll bar on mobile */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;
