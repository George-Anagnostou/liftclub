import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
// Utils
import { getPublicWorkouts, getWorkoutsFromIdArray, saveSavedWorkouts } from "../utils/ApiSupply";
// Context
import { useStoreState } from "../store";

export default function workoutFeed() {
  const { user } = useStoreState();

  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [publicWorkouts, setPublicWorkouts] = useState([]);

  const workoutIsSaved = (workout) => {
    return savedWorkouts.map((each) => each._id).includes(workout._id);
  };

  const updateStateAndSaveToDB = (workoutArr) => {
    // Update State
    setSavedWorkouts(workoutArr);
    // Grab workout ids and save to DB
    const idArr = workoutArr.map((each) => each._id);
    saveSavedWorkouts(idArr, user._id);
  };

  const addToSavedWorkouts = (workout) => {
    if (!workoutIsSaved(workout)) {
      const updatedWorkouts = [...savedWorkouts, workout];
      updateStateAndSaveToDB(updatedWorkouts);
    }
  };

  const removeFromSavedWorkouts = (workout) => {
    const updatedWorkouts = savedWorkouts.filter((each) => each._id !== workout._id);
    updateStateAndSaveToDB(updatedWorkouts);
  };

  const getSavedWorkouts = async () => {
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);

    // Sort the array based on the order of the user.savedWorkouts
    workouts.sort((a, b) => user.savedWorkouts.indexOf(a._id) - user.savedWorkouts.indexOf(b._id));

    setSavedWorkouts(workouts);
  };

  const getAllPublicWorkouts = async () => {
    const workouts = await getPublicWorkouts();
    setPublicWorkouts(workouts);
  };

  useEffect(() => {
    if (user) {
      // Get all workotus saved by the user
      getSavedWorkouts();
      // Get all public workouts
      getAllPublicWorkouts();
    }
  }, [user]);

  return (
    <Layout>
      <h2>Workout Feed</h2>
      <WorkoutFeedContainer>
        <PublicWorkoutsContainer>
          <h3>Public Workouts</h3>
          {publicWorkouts.map((workout) => (
            <li key={"public" + workout._id}>
              {workout.name}

              {workoutIsSaved(workout) ? (
                <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
                  -
                </button>
              ) : (
                <button className="add" onClick={() => addToSavedWorkouts(workout)}>
                  +
                </button>
              )}
            </li>
          ))}
        </PublicWorkoutsContainer>

        <SavedWorkoutsContainer>
          <h3>Saved Workouts</h3>
          {savedWorkouts.map((workout) => (
            <li key={"saved" + workout._id}>
              {workout.name}

              <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
                -
              </button>
            </li>
          ))}
        </SavedWorkoutsContainer>
      </WorkoutFeedContainer>
    </Layout>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;

  .remove {
    background: #fdebdf;
  }
  .add {
    background: #eaeeff;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const SavedWorkoutsContainer = styled.ul`
  width: 50%;

  li {
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    padding: 0.5rem;
    margin: 1rem;
    text-transform: capitalize;
    position: relative;

    button {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      position: absolute;
      top: 0px;
      right: 0px;
      height: 100%;
      width: 50px;
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PublicWorkoutsContainer = styled.ul`
  width: 50%;

  li {
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    padding: 0.5rem;
    margin: 1rem;
    text-transform: capitalize;
    position: relative;

    button {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      position: absolute;
      top: 0px;
      right: 0px;
      height: 100%;
      width: 50px;
      font-size: 2rem;

      &:hover {
        background: #c9c9c9;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
