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
import RoutineViewer from "./RoutineViewer";

export default function RoutineTile({ team, setTeam }) {
  const { user } = useStoreState();

  const [uniqueWorkoutsInRoutine, setUniqueWorkoutsInRoutine] = useState(null);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState(null);

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

        <p className="routineStats">
          {plan.length} workouts • {days}
        </p>
      </RoutineInfo>
    );
  };

  return (
    <Container>
      <div className="heading">
        <h3 className="title">Routine</h3>
      </div>

      {formatRoutineInfo(team.routine)}

      <RoutineViewer routine_id={team.routine._id} setTeam={setTeam} />

      {uniqueWorkoutsInRoutine && userSavedWorkouts ? (
        <>
          <h3 className="title">All workouts</h3>
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
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  text-align: left;

  .routineName {
    flex: 1;
    font-weight: 100;
    font-size: 1.75rem;
  }

  .routineStats {
    color: ${({ theme }) => theme.textLight};
    font-size: 1rem;
  }
`;

const UniqueWorkoutList = styled.ul`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  border-radius: 5px;

  li {
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.5rem 0.5rem;
    margin-right: 0.25rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    min-width: max-content;

    button {
      margin-left: 0.5rem;
      cursor: pointer;
      border-radius: 5px;
      border: none;
      padding: 0.25rem;
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

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

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
