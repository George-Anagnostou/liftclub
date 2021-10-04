import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addSavedWorkout, removeSavedWorkout } from "../../store/actions/userActions";
// Utils
import { getWorkoutsFromIdArray } from "../../utils/api";
import { Routine, Team, Workout } from "../../utils/interfaces";
// Components
import LoadingSpinner from "../LoadingSpinner";
import CalendarContainer from "./CalendarContainer";

interface Props {
  team: Team;
}

const RoutineTile: React.FC<Props> = ({ team }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [uniqueWorkoutsInRoutine, setUniqueWorkoutsInRoutine] = useState<Workout[] | null>(null);

  const handleAddSavedWorkout = async (workout_id: string) => {
    addSavedWorkout(dispatch, user!._id, workout_id);
  };

  const handleRemoveSavedWorkout = async (workout_id: string) => {
    removeSavedWorkout(dispatch, user!._id, workout_id);
  };

  const getUniqueWorkouts = async (plan: Routine["workoutPlan"]) => {
    const uniqueWorkoutIds = [...new Set(plan.map((workout) => workout.workout_id))];
    const workouts = await getWorkoutsFromIdArray(uniqueWorkoutIds);

    //Sort by workout name length for UI effect
    workouts.sort((a, b) => a.name.length - b.name.length);
    setUniqueWorkoutsInRoutine(workouts);
  };

  useEffect(() => {
    if (team?.routine) getUniqueWorkouts(team.routine.workoutPlan);
  }, [team.routine]);

  return (
    <Container>
      <h3 className="title">Routine</h3>

      {user?._id === team.routine.creator_id && (
        <Link href={`/builder?builder=routine&routine=${team.routine._id}`}>
          <button className="editBtn">Edit</button>
        </Link>
      )}

      <RoutineInfo>
        <p className="routineName">{team.routine.name}</p>

        <p className="routineStats">{team.routine.workoutPlan.length} workouts</p>
      </RoutineInfo>

      <CalendarContainer routine={team.routine} />

      {uniqueWorkoutsInRoutine ? (
        <>
          <h3 className="title">All workouts</h3>
          <UniqueWorkoutList>
            {uniqueWorkoutsInRoutine.map((workout) => (
              <li key={workout._id}>
                <p>{workout.name}</p>
                {user?.savedWorkouts?.includes(workout._id) ? (
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
};
export default RoutineTile;

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  position: relative;

  .editBtn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    border-radius: 5px;
    padding: 0.1rem 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    font-size: 0.8rem;
  }
`;

const RoutineInfo = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  text-align: left;

  .routineName {
    flex: 1;
    font-weight: 300;
    font-size: 1.5rem;
  }

  .routineStats {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.8rem;
  }
`;

const UniqueWorkoutList = styled.ul`
  display: flex;
  flex-wrap: wrap;

  li {
    text-align: left;
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.25rem 0.5rem;
    margin: 0 0.25rem 0.5rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    font-weight: 300;
    font-size: 0.9rem;

    button {
      font-size: 0.7rem;
      width: 45px;
      min-width: 45px;
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
        box-shadow: none;
      }
    }
  }
`;
