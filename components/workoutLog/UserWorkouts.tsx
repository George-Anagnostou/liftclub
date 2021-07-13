import { useEffect, useState } from "react";
import styled from "styled-components";
// API
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  displayWorkout: (clicked: Workout) => Promise<void>;
}
const UserWorkouts: React.FC<Props> = ({ displayWorkout }) => {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState<Workout[]>([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState<Workout[]>([]);
  const [showUserMade, setShowUserMade] = useState(true);
  const [showUserSaved, setShowUserSaved] = useState(true);

  const loadUserMadeWorkouts = async () => {
    const madeWorkouts = await getUserMadeWorkouts(user!._id);
    setUserMadeWorkouts(madeWorkouts || []);
  };

  const loadUserSavedWorkouts = async () => {
    const savedWorkouts = await getWorkoutsFromIdArray(user!.savedWorkouts || []);
    setUserSavedWorkouts(savedWorkouts.reverse() || []);
  };

  useEffect(() => {
    if (user) {
      // Get all workouts made by the user
      loadUserMadeWorkouts();
      // Get all workotus saved by the user
      loadUserSavedWorkouts();
    }
  }, [user]);

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
                  <p>{workout.name}</p>
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
                  <p>{workout.name}</p>
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
    font-weight: 100;
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
    overflow: scroll;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem;
      margin: 0 0.5rem 0.5rem;
      min-width: max-content;

      p {
        text-transform: capitalize;
        width: max-content;
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

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
