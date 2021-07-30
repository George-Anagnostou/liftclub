import { useState } from "react";
import styled from "styled-components";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  displayWorkout: (clicked: Workout) => Promise<void>;
  userMadeWorkouts: Workout[];
  userSavedWorkouts: Workout[];
}

const UserWorkouts: React.FC<Props> = ({ displayWorkout, userMadeWorkouts, userSavedWorkouts }) => {
  const [showUserMade, setShowUserMade] = useState(true);
  const [showUserSaved, setShowUserSaved] = useState(true);

  return (
    <Container>
      <WorkoutsList>
        <TitleBar>
          <h3>Created</h3>
          <button onClick={() => setShowUserMade(!showUserMade)}>
            {showUserMade ? "close" : "show"}
          </button>
        </TitleBar>

        {showUserMade &&
          (userMadeWorkouts.length ? (
            <ul>
              {userMadeWorkouts.map((workout) => (
                <li key={workout._id} onClick={() => displayWorkout(workout)}>
                  {workout.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="fallbackText">None</p>
          ))}
      </WorkoutsList>

      <WorkoutsList>
        <TitleBar>
          <h3>Saved</h3>
          <button onClick={() => setShowUserSaved(!showUserSaved)}>
            {showUserSaved ? "close" : "show"}
          </button>
        </TitleBar>

        {showUserSaved &&
          (userSavedWorkouts.length ? (
            <ul>
              {userSavedWorkouts.map((workout) => (
                <li key={workout._id} onClick={() => displayWorkout(workout)}>
                  {workout.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="fallbackText">None</p>
          ))}
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

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    padding-left: 0.75rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  button {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText};
    border-radius: 5px;
    padding: 8px 12px;
    margin: 8px;
    border: none;
  }
`;

const WorkoutsList = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

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
      margin: 0 0.5rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
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

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
