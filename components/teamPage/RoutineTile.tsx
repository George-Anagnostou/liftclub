import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addSavedWorkout, removeSavedWorkout } from "../../store/actions/userActions";
// Utils
import { daysBetween } from "../../utils";
import { getWorkoutsFromIdArray } from "../../utils/api";
import { Routine, Team, Workout } from "../../utils/interfaces";
// Components
import LoadingSpinner from "../LoadingSpinner";
import RoutineViewer from "./RoutineViewer";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
}

const RoutineTile: React.FC<Props> = ({ team, setTeam }) => {
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

  const renderRoutineInfo = (routine: Routine) => {
    const plan = routine.workoutPlan;
    const days = daysBetween(plan[0].isoDate, plan[plan.length - 1].isoDate);

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

      {team.routine && (
        <>
          {renderRoutineInfo(team.routine)}

          <RoutineViewer routine_id={team.routine._id} setTeam={setTeam} />
        </>
      )}

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
    font-weight: 400;
    font-size: 1.75rem;
  }

  .routineStats {
    color: ${({ theme }) => theme.textLight};
    font-size: 1rem;
  }
`;

const UniqueWorkoutList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;

  li {
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.5rem 0.5rem;
    margin: 0 0.25rem 0.5rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    min-width: max-content;

    button {
      font-size: 0.7rem;
      width: 45px;
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
