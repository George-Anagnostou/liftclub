import styled from "styled-components";
// Context
import { useBuilderState } from "../../../store";
// Interfaces
import { Workout, Routine } from "../../../utils/interfaces";

interface Props {
  selectedDaysFromPlan: Routine["workoutPlan"];
  addWorkoutToDatesSelected: (workout: Workout) => void;
}

const UserWorkouts: React.FC<Props> = ({ selectedDaysFromPlan, addWorkoutToDatesSelected }) => {
  const { workouts } = useBuilderState();

  const renderWorkoutItem = (workout: Workout) => {
    const isWorkoutInSelected = selectedDaysFromPlan.filter(
      (day) => day.workout_id === workout._id
    ).length;

    return (
      <li
        key={workout._id}
        onClick={() => addWorkoutToDatesSelected(workout)}
        className={isWorkoutInSelected ? "highlight" : ""}
      >
        {workout.name}
      </li>
    );
  };

  return (
    <Container>
      <WorkoutsList>
        <h3>Created</h3>

        <ul>
          {workouts.created && Boolean(workouts.created.length) ? (
            workouts.created.map((workout, i) => renderWorkoutItem(workout))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>
        <ul>
          {workouts.saved && Boolean(workouts.saved.length) ? (
            workouts.saved.map((workout, i) => renderWorkoutItem(workout))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>
    </Container>
  );
};
export default UserWorkouts;

const Container = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const WorkoutsList = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

  h3 {
    text-align: left;
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      font-weight: 300;

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
