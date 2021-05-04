import { useEffect, useState } from "react";

import Layout from "../components/Layout";
// Utils
import { getPublicWorkouts, getWorkoutsFromIdArray } from "../utils/ApiSupply";
// Context
import { useStoreState } from "../store";

export default function workoutFeed() {
  const { user } = useStoreState();

  const [userSavedWorkouts, setUserSavedWorkouts] = useState([]);
  const [publicWorkouts, setPublicWorkouts] = useState([]);

  const saveWorkoutToUser = (workout) => {
    console.log(workout);
  };

  const getUserSavedWorkouts = async () => {
    const savedWorkouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setUserSavedWorkouts(savedWorkouts);
  };

  const getAllPublicWorkouts = async () => {
    const allPublicWorkouts = await getPublicWorkouts();
    setPublicWorkouts(allPublicWorkouts);
  };

  useEffect(() => {
    if (user) {
      // Get all workotus saved by the user
      getUserSavedWorkouts();
      // Get all public workouts
      getAllPublicWorkouts();
    }
  }, [user]);

  return (
    <Layout>
      <h1>Workout Feed</h1>
      <h3>Saved Workouts</h3>
      {userSavedWorkouts.map((each) => (
        <p key={"saved" + each._id}>{each.name}</p>
      ))}
      <h3>Public Workouts</h3>
      {publicWorkouts.map((each) => (
        <p key={"public" + each._id} onClick={() => saveWorkoutToUser(each)}>
          {each.name}
        </p>
      ))}
    </Layout>
  );
}
