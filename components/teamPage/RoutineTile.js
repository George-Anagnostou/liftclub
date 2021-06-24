import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
// Utils
import { timeBetween } from "../../utils";
import {
  addUserSavedWorkout,
  getWorkoutsFromIdArray,
  removeUserSavedWorkout,
} from "../../utils/api";
// Components
import LoadingSpinner from "../LoadingSpinner";
import RoutineEditor from "./RoutineEditor";

export default function RoutineTile({ team, setTeam }) {
  const { user } = useStoreState();

  const [uniqueWorkoutsInRoutine, setUniqueWorkoutsInRoutine] = useState(null);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState(null);
  const [showRoutineEditor, setShowRoutineEditor] = useState(false);

  const handleAddSavedWorkout = async (workout_id) => {
    const added = await addUserSavedWorkout(user._id, workout_id);
    if (added) setUserSavedWorkouts((prev) => [...prev, workout_id]);
  };

  const handleRemoveSavedWorkout = async (workout_id) => {
    const removed = await removeUserSavedWorkout(user._id, workout_id);
    if (removed) setUserSavedWorkouts((prev) => prev.filter((id) => id !== workout_id));
  };

  const getUniqueWorkouts = async (plan) => {
    const uniqueWorkoutIds = [...new Set(plan.map((workout) => workout.workout_id))];
    const workouts = await getWorkoutsFromIdArray(uniqueWorkoutIds);
    setUniqueWorkoutsInRoutine(workouts);
  };

  useEffect(() => {
    if (team) getUniqueWorkouts(team.routine.workoutPlan);
  }, [team]);

  useEffect(() => {
    if (user) setUserSavedWorkouts(user.savedWorkouts || []);
  }, [user]);

  const formatRoutineInfo = (routine) => {
    const plan = routine.workoutPlan;

    const days = timeBetween(new Date(plan[0].isoDate), new Date(plan[plan.length - 1].isoDate));

    return (
      <RoutineInfo>
        <p className="routineName">{routine.name}</p>

        <div>
          <p>{plan.length} total workouts</p>
          <p>over {days}</p>
        </div>
      </RoutineInfo>
    );
  };

  return (
    <Container>
      <div className="heading">
        <h3 className="title">Routine</h3>
        {/* {user._id === team.creator_id && ( */}
        <button onClick={() => setShowRoutineEditor(true)}>View Routine</button>
        {/* )} */}
      </div>

      {showRoutineEditor && (
        <RoutineEditor
          routine_id={team.routine._id}
          setTeam={setTeam}
          setShowRoutineEditor={setShowRoutineEditor}
        />
      )}

      {formatRoutineInfo(team.routine)}

      {uniqueWorkoutsInRoutine && userSavedWorkouts ? (
        <>
          <h3 className="title">Workouts in this routine</h3>
          <UniqueWorkoutList>
            {uniqueWorkoutsInRoutine.map((workout) => (
              <li key={workout._id}>
                <p>{workout.name}</p>
                {userSavedWorkouts.includes(workout._id) ? (
                  <button className="saved" onClick={() => handleRemoveSavedWorkout(workout._id)}>
                    saved
                  </button>
                ) : (
                  <button className="save" onClick={() => handleAddSavedWorkout(workout._id)}>
                    save
                  </button>
                )}
              </li>
            ))}
          </UniqueWorkoutList>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 0.5rem;
  border-radius: 10px;

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    button {
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      border: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
    }
  }
`;

const RoutineInfo = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  .routineName {
    text-align: left;
    flex: 1;
    font-weight: 300;
    font-size: 1.75rem;
  }

  div {
    text-align: right;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const UniqueWorkoutList = styled.ul`
  display: flex;

  li {
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.5rem 0.5rem;
    border-radius: 10px;

    p {
      margin-bottom: 0.5rem;
    }

    button {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      padding: 0.5rem;

      &.save {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }

      &.saved {
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
      }
    }
  }
`;
