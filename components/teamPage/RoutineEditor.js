import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// API
import {
  getRoutineFromId,
  getUserMadeWorkouts,
  getWorkoutsFromIdArray,
  updateRoutine,
} from "../../utils/api";
import LoadingSpinner from "../LoadingSpinner";
// Components
import Calendar from "./Calendar";

export default function RoutineEditor({ routine_id, setShowRoutineEditor, setTeam, team, user }) {
  const shadow = useRef(null);

  const [routine, setRoutine] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isRoutineOwner, setIsRoutineOwner] = useState(false);
  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState([]);

  const addWorkoutToRoutine = (workout) => {
    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => each.isoDate !== selectedDate),
        { isoDate: selectedDate, workout_id: workout._id, workout },
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    }));
  };

  const removeWorkoutFromRoutine = () => {
    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [...prev.workoutPlan.filter((each) => each.isoDate !== selectedDate)],
    }));
  };

  const handleSaveRoutine = async () => {
    const routineForDB = {
      ...routine,
      workoutPlan: routine.workoutPlan.map(({ isoDate, workout_id }) => ({
        isoDate,
        workout_id,
      })),
    };

    const saved = await updateRoutine(routineForDB);

    if (saved) {
      setIsEditing(false);
      setTeam((prev) => ({ ...prev, routine: routineForDB }));
    }
  };

  const handleRoutineNameChange = ({ target }) =>
    setRoutine((prev) => ({ ...prev, name: target.value }));

  const handleShadowClick = ({ target }) => {
    if (target.classList.contains("shadow")) setShowRoutineEditor(false);
  };

  useEffect(() => {
    const getRoutineData = async () => {
      const routineData = await getRoutineFromId(routine_id);
      setRoutine(routineData);
      setIsRoutineOwner(user._id === routineData.creator_id);
    };

    if (!routine) getRoutineData();
  }, [routine]);

  useEffect(() => {
    const getUserWorkouts = async () => {
      const workoutsMade = await getUserMadeWorkouts(user._id);
      setUserMadeWorkouts(workoutsMade);

      const workoutsSaved = await getWorkoutsFromIdArray(user.savedWorkouts);
      setUserSavedWorkouts(workoutsSaved.reverse());
    };

    if (isRoutineOwner) getUserWorkouts();
  }, [isRoutineOwner]);

  const displaySelectedDate = () => {
    const foundWorkout = routine.workoutPlan.filter(
      (item) => item.isoDate.substring(0, 10) === selectedDate?.substring(0, 10)
    )[0]?.workout;

    return (
      <div className="ctrl">
        {selectedDate ? (
          foundWorkout ? (
            <div>
              <p>{foundWorkout.name}</p>
              <p>{foundWorkout.exercises.length} exercises</p>
            </div>
          ) : isEditing ? (
            <p className="textLight">Select a workout from below</p>
          ) : (
            <p className="textLight">No workout</p>
          )
        ) : (
          <p className="textLight">Tap a date to view its workout</p>
        )}

        {isEditing && (
          <WorkoutSelector>
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
          </WorkoutSelector>
        )}
      </div>
    );
  };

  return (
    <Shadow ref={shadow} className="shadow" onClick={handleShadowClick}>
      {routine ? (
        <Editor>
          <button className="closeBtn" onClick={() => setShowRoutineEditor(false)}>
            X
          </button>

          <div className="name">
            {isEditing ? (
              <input
                type="text"
                name="routineName"
                value={routine.name}
                onChange={handleRoutineNameChange}
              />
            ) : (
              <p>{routine.name}</p>
            )}
          </div>

          {displaySelectedDate()}

          <h3 className="title">Schedule</h3>
          <Calendar
            data={routine.workoutPlan}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />

          {isEditing && (
            <button className="bottomBtn" onClick={handleSaveRoutine}>
              Save
            </button>
          )}

          {isRoutineOwner && !isEditing && (
            <button className="bottomBtn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </Editor>
      ) : (
        <div className="loadingContainer">
          <LoadingSpinner />
        </div>
      )}
    </Shadow>
  );
}

const Shadow = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.opacityBackground};
  z-index: 99999;
`;

const Editor = styled.div`
  margin: 1rem auto 0;
  padding: 0rem 0.5rem 0.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  max-width: 400px;
  width: 95%;
  position: relative;
  overflow: hidden;

  .name {
    padding: 1.5rem 0 0.5rem;
    margin: 0 -0.5rem 0.5em;
    font-size: 1.5rem;
    display: flex;

    p {
      flex: 1;
      margin: 0 1rem;
    }

    input {
      flex: 1;
      border-radius: 5px;
      border: none;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.text};
      text-align: center;
      font-size: 1.5rem;
      font-family: inherit;
      margin: 0 0.5rem;
    }
  }

  .closeBtn {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    padding: 0.2rem 0.4rem;
    font-size: 10px;
  }

  .ctrl {
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

  .title {
    margin-top: 1rem;
  }

  .bottomBtn {
    border-radius: 5px;
    padding: 0.75rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }
`;

const WorkoutSelector = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  border-radius: 5px;
  background: ${({ theme }) => theme.buttonLight};

  ul {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;

    &:first-of-type {
      margin-bottom: 0.5rem;
    }

    li {
      background: ${({ theme }) => theme.background};
      margin: 0 0.5rem;
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
