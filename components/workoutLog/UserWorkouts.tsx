import styled from "styled-components";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  displayWorkout: (clicked: Workout) => Promise<void>;
  userMadeWorkouts: Workout[];
  userSavedWorkouts: Workout[];
}

const UserWorkouts: React.FC<Props> = ({ displayWorkout, userMadeWorkouts, userSavedWorkouts }) => {
  return (
    <Container>
      <WorkoutsList>
        <h3>Created</h3>

        {Boolean(userMadeWorkouts.length) ? (
          <ul>
            {userMadeWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                {workout.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="fallbackText">None</p>
        )}
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>

        {Boolean(userSavedWorkouts.length) ? (
          <ul>
            {userSavedWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                {workout.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="fallbackText">None</p>
        )}
      </WorkoutsList>
    </Container>
  );
};
export default UserWorkouts;

const Container = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      position: relative;
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem 1rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
